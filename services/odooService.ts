
import { OdooSession, Product, Category, PrescriptionStatus, WebCategoryMap } from '../types';

const serialize = (value: any): string => {
  if (value === null || value === undefined) return '<value><nil/></value>';
  if (typeof value === 'number') return Number.isInteger(value) ? `<value><int>${value}</int></value>` : `<value><double>${value}</double></value>`;
  if (typeof value === 'string') return `<value><string>${value.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</string></value>`;
  if (typeof value === 'boolean') return `<value><boolean>${value ? '1' : '0'}</boolean></value>`;
  if (Array.isArray(value)) return `<value><array><data>${value.map(v => serialize(v)).join('')}</data></array></value>`;
  if (typeof value === 'object') return `<value><struct>${Object.entries(value).map(([k, v]) => `<member><name>${k}</name>${serialize(v)}</member>`).join('')}</struct></value>`;
  return `<value><string>${value}</string></value>`;
};

const parseValue = (node: Element | null): any => {
  if (!node) return null;
  const child = node.firstElementChild;
  if (!child) return node.textContent?.trim() || "";
  
  const tag = child.tagName.toLowerCase();
  if (tag === 'string') return child.textContent || "";
  if (tag === 'int' || tag === 'i4') return parseInt(child.textContent || '0', 10);
  if (tag === 'double') return parseFloat(child.textContent || '0');
  if (tag === 'boolean') return child.textContent === '1' || child.textContent === 'true';
  if (tag === 'array') {
    const data = child.querySelector('data');
    if (!data) return [];
    return Array.from(data.children).map(v => parseValue(v as Element));
  }
  if (tag === 'struct') {
    const obj: any = {};
    Array.from(child.children).forEach(member => {
      const name = member.querySelector('name')?.textContent;
      const val = member.querySelector('value');
      if (name && val) obj[name] = parseValue(val);
    });
    return obj;
  }
  return child.textContent || "";
};

export class OdooClient {
  constructor(private url: string, private db: string) {}

  private async rpc(endpoint: string, method: string, params: any[]): Promise<any> {
    const xml = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>${params.map(p => `<param>${serialize(p)}</param>`).join('')}</params></methodCall>`;
    const target = `${this.url.replace(/\/$/, '')}/xmlrpc/2/${endpoint}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(target)}`;
    
    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xml
      });
      
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/xml');
      
      // Manejo de errores XML-RPC (Faults)
      const fault = doc.querySelector('fault');
      if (fault) {
        const faultValue = fault.querySelector('value');
        const faultData = parseValue(faultValue);
        throw new Error(faultData?.faultString || 'Odoo RPC Fault');
      }

      const valNode = doc.querySelector('param value');
      if (!valNode) {
        throw new Error('La respuesta de Odoo no contiene datos válidos.');
      }

      return parseValue(valNode);
    } catch (e: any) {
      console.error("RPC Error:", e);
      throw new Error(e.message || "Error de red al conectar con Odoo.");
    }
  }

  async authenticate(user: string, pass: string): Promise<number> {
    return await this.rpc('common', 'authenticate', [this.db, user, pass, {}]);
  }

  async execute(uid: number, pass: string, model: string, method: string, args: any[], kwargs: any = {}): Promise<any> {
    return await this.rpc('object', 'execute_kw', [this.db, uid, pass, model, method, args, kwargs]);
  }
}

export const OdooService = {
  client: null as OdooClient | null,

  async connect(url: string, db: string, user: string, pass: string) {
    const client = new OdooClient(url, db);
    const uid = await client.authenticate(user, pass);
    if (!uid) throw new Error("Credenciales inválidas o base de datos incorrecta.");
    this.client = client;
    return { uid, client };
  },

  async fetchProducts(session: OdooSession, mappings: WebCategoryMap[], publishedIds: number[]): Promise<Product[]> {
    if (!this.client) return [];
    
    const domain: any[][] = [
      ['sale_ok', '=', true],
      ['company_id', '=', session.companyId]
    ];
    
    if (publishedIds.length > 0) {
      domain.push(['id', 'in', publishedIds]);
    } else {
      return [];
    }

    const fields = ['id', 'name', 'list_price', 'qty_available', 'image_1920', 'categ_id', 'manufacturer_id', 'description_sale'];
    const raw = await this.client.execute(session.uid, session.apiKey, 'product.product', 'search_read', [domain], { fields });

    return raw.map((p: any) => {
      const mapping = mappings.find(m => m.odooCategoryId === p.categ_id?.[0]);
      return {
        id: `odoo-${p.id}`,
        odooId: p.id,
        name: p.name,
        brand: p.manufacturer_id?.[1] || 'Genérico',
        price: p.list_price || 0,
        category: mapping?.webCategory || Category.Medicamentos,
        prescription: PrescriptionStatus.NotRequired,
        description: p.description_sale || '',
        dosage: '',
        format: '',
        stock: p.qty_available || 0,
        image: p.image_1920 ? `data:image/png;base64,${p.image_1920}` : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
        thumbnails: [],
        laboratory: '',
        registrationNumber: '',
        expiryDate: '',
        published: true
      };
    });
  }
};
