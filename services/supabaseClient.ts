
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://cnopvdntcmaxvrmhfheb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub3B2ZG50Y21heHZybWhmaGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzc4NzIsImV4cCI6MjA4MjcxMzg3Mn0.dyW_ZHtPb99oIGDNMgpegRh_GMUWHnQXrkHz7C6EPWo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Guarda la configuración de la tienda en Supabase (Upsert).
 * Se asume que existe una tabla 'stores' con las columnas correspondientes.
 */
export const saveStoreToSupabase = async (storeId: string, config: any) => {
  console.log(`Guardando configuración para ${storeId} en Supabase...`);
  const { data, error } = await supabase
    .from('stores')
    .upsert({ 
      id: storeId, 
      name: config.name,
      primaryColor: config.primaryColor,
      accentColor: config.accentColor,
      odooUrl: config.odooUrl,
      odooDb: config.odooDb,
      odooUser: config.odooUser,
      odooKey: config.odooKey
    });

  if (error) {
    console.error('Error al guardar en Supabase:', error.message);
    throw error;
  }
  return { success: true, data };
};

/**
 * Recupera la configuración de la tienda desde Supabase.
 */
export const fetchStoreFromSupabase = async (storeId: string) => {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .single();

  if (error) {
    console.warn('Configuración no encontrada en Supabase o error de tabla:', error.message);
    return null;
  }
  return data;
};
