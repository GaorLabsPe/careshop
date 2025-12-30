
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig } from '../types';
import { saveStoreToSupabase, fetchStoreFromSupabase } from '../services/supabaseClient';

interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: StoreConfig) => Promise<void>;
  isLoading: boolean;
  isOdooConnected: boolean;
  setOdooConnected: (val: boolean) => void;
}

const DEFAULT_CONFIG: StoreConfig = {
  name: 'careShop',
  primaryColor: '#10B981',
  accentColor: '#F97316',
  odooUrl: '',
  odooDb: '',
  odooUser: '',
  odooKey: ''
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('saas_store_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOdooConnected, setOdooConnected] = useState(false);

  // Al montar la aplicación, intentamos cargar la configuración desde Supabase
  useEffect(() => {
    const loadFromCloud = async () => {
      setIsLoading(true);
      try {
        const cloudData = await fetchStoreFromSupabase('default_store');
        if (cloudData) {
          const { id, ...rest } = cloudData;
          setConfig(rest as StoreConfig);
        }
      } catch (err) {
        console.error("Error al cargar configuración de la nube:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFromCloud();
  }, []);

  useEffect(() => {
    // Aplicar CSS Variables al Documento
    document.documentElement.style.setProperty('--primary', config.primaryColor);
    document.documentElement.style.setProperty('--accent', config.accentColor);
    
    // Generar variantes para hover y transparencias
    document.documentElement.style.setProperty('--primary-hover', config.primaryColor + 'dd');
    document.documentElement.style.setProperty('--accent-hover', config.accentColor + 'dd');
    document.documentElement.style.setProperty('--primary-light', config.primaryColor + '20');

    localStorage.setItem('saas_store_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = async (newConfig: StoreConfig) => {
    setIsLoading(true);
    try {
      // Guardar en Supabase para persistencia multi-dispositivo y SaaS
      await saveStoreToSupabase('default_store', newConfig);
      setConfig(newConfig);
    } catch (err) {
      console.error("Error al actualizar configuración en la nube:", err);
      // Actualizamos localmente de todos modos para feedback inmediato
      setConfig(newConfig);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StoreContext.Provider value={{ config, updateConfig, isLoading, isOdooConnected, setOdooConnected }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
