
import { Product, Category, PrescriptionStatus } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Amoxicilina 500mg',
    genericName: 'Amoxicilina',
    activeIngredient: 'Amoxicilina Trihidrato',
    brand: 'Genfar',
    price: 12.50,
    oldPrice: 15.00,
    category: Category.Medicamentos,
    prescription: PrescriptionStatus.Required,
    description: 'Antibiótico de amplio espectro para el tratamiento de infecciones bacterianas.',
    dosage: 'Cada 8 horas por 7 días',
    format: '30 Comprimidos',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631549916768-4119cb8e0f72?q=80&w=200&auto=format&fit=crop'
    ],
    laboratory: 'Genfar Labs',
    registrationNumber: 'RS-77281',
    expiryDate: '2025-12-30'
  },
  {
    id: '2',
    name: 'Suxnix Vitamin C + Zinc',
    genericName: 'Suplemento Vitamínico',
    activeIngredient: 'Ácido Ascórbico + Zinc',
    brand: 'Suxnix',
    price: 29.99,
    category: Category.Vitaminas,
    prescription: PrescriptionStatus.NotRequired,
    description: 'Refuerza tu sistema inmunológico con nuestra fórmula avanzada de Vitamina C y Zinc.',
    dosage: '1 comprimido efervescente al día',
    format: '20 Comprimidos Efervescentes',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1616671285527-33104d47102e?q=80&w=800&auto=format&fit=crop',
    thumbnails: [],
    laboratory: 'Suxnix Pharma',
    registrationNumber: 'RS-99120',
    expiryDate: '2026-06-15'
  },
  {
    id: '3',
    name: 'La Roche-Posay Effaclar Duo+',
    brand: 'La Roche-Posay',
    price: 24.50,
    category: Category.Dermocosmeticos,
    prescription: PrescriptionStatus.NotRequired,
    description: 'Tratamiento corrector anti-imperfecciones que desincrusta los poros y previene las marcas.',
    dosage: 'Aplicar mañana y noche en rostro limpio',
    format: 'Crema 40ml',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    thumbnails: [],
    laboratory: 'L\'Oréal Division Cosmétique Active',
    registrationNumber: 'C-FR-123',
    expiryDate: '2025-10-01'
  },
  {
    id: '4',
    name: 'Ibuprofeno 400mg',
    genericName: 'Ibuprofeno',
    activeIngredient: 'Ibuprofeno',
    brand: 'Advil',
    price: 8.90,
    oldPrice: 10.50,
    category: Category.Medicamentos,
    prescription: PrescriptionStatus.NotRequired,
    description: 'Analgésico y antiinflamatorio para el alivio del dolor moderado y fiebre.',
    dosage: '1 cápsula cada 8 horas',
    format: '10 Cápsulas Blandas',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=800&auto=format&fit=crop',
    thumbnails: [],
    laboratory: 'GSK',
    registrationNumber: 'RS-44512',
    expiryDate: '2026-11-20'
  }
];
