import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: { 
    en: string;
    pt: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

// all the translations for the app
const translations: Translations = {
  // dashboard screen
  'dashboard.title': { en: 'Dashboard', pt: 'Painel' },
  'dashboard.welcome.morning': { en: 'Good Morning', pt: 'Bom Dia' },
  'dashboard.welcome.afternoon': { en: 'Good Afternoon', pt: 'Boa Tarde' },
  'dashboard.welcome.evening': { en: 'Good Evening', pt: 'Boa Noite' },
  'dashboard.welcome.subtitle': { en: "Here's your business overview", pt: 'Aqui está sua visão geral de negócios' },
  'dashboard.activeJobs': { en: 'Active Jobs', pt: 'Trabalhos Ativos' },
  'dashboard.totalCustomers': { en: 'Total Customers', pt: 'Total de Clientes' },
  'dashboard.quickActions': { en: 'Quick Actions', pt: 'Ações Rápidas' },
  'dashboard.addCustomer': { en: 'Add Customer', pt: 'Adicionar Cliente' },
  'dashboard.createJob': { en: 'Create Job', pt: 'Criar Trabalho' },

  // customers screen
  'customers.title': { en: 'Customers', pt: 'Clientes' },
  'customers.search': { en: 'Search customers...', pt: 'Buscar clientes...' },
  'customers.jobs': { en: 'jobs', pt: 'trabalhos' },
  'customers.empty': { en: 'No customers yet', pt: 'Nenhum cliente ainda' },
  'customers.emptyDesc': { en: 'Add your first customer to get started', pt: 'Adicione seu primeiro cliente para começar' },

  // customer details screen
  'customerDetails.title': { en: 'Customer Details', pt: 'Detalhes do Cliente' },
  'customerDetails.commercial': { en: 'Commercial Client', pt: 'Cliente Comercial' },
  'customerDetails.email': { en: 'Email', pt: 'E-mail' },
  'customerDetails.phone': { en: 'Phone', pt: 'Telefone' },
  'customerDetails.address': { en: 'Address', pt: 'Endereço' },
  'customerDetails.viewLocation': { en: 'View Location', pt: 'Ver Localização' },
  'customerDetails.contactPerson': { en: 'Contact Person', pt: 'Pessoa de Contato' },
  'customerDetails.activeJobs': { en: 'Active Jobs', pt: 'Trabalhos Ativos' },

  // add customer screen
  'addCustomer.title': { en: 'Add Customer', pt: 'Adicionar Cliente' },
  'addCustomer.name': { en: 'Customer Name', pt: 'Nome do Cliente' },
  'addCustomer.email': { en: 'Email Address', pt: 'Endereço de E-mail' },
  'addCustomer.phone': { en: 'Phone Number', pt: 'Número de Telefone' },
  'addCustomer.contactPerson': { en: 'Contact Person', pt: 'Pessoa de Contato' },
  'addCustomer.save': { en: 'Save Customer', pt: 'Salvar Cliente' },
  'addCustomer.cancel': { en: 'Cancel', pt: 'Cancelar' },

  // reports screen
  'reports.title': { en: 'Reports', pt: 'Relatórios' },
  'reports.empty': { en: 'No reports yet', pt: 'Nenhum relatório ainda' },
  'reports.emptyDesc': { en: 'Create your first report to get started', pt: 'Crie seu primeiro relatório para começar' },

  // add report screen
  'addReport.title': { en: 'Add Report', pt: 'Adicionar Relatório' },
  'addReport.reportTitle': { en: 'Report Title', pt: 'Título do Relatório' },
  'addReport.description': { en: 'Description', pt: 'Descrição' },
  'addReport.date': { en: 'Date', pt: 'Data' },
  'addReport.takePhoto': { en: 'Take Photo', pt: 'Tirar Foto' },
  'addReport.choosePhoto': { en: 'Choose from Gallery', pt: 'Escolher da Galeria' },
  'addReport.save': { en: 'Save Report', pt: 'Salvar Relatório' },
  'addReport.cancel': { en: 'Cancel', pt: 'Cancelar' },

  // jobs screen
  'jobs.title': { en: 'Jobs', pt: 'Trabalhos' },
  'jobs.comingSoon': { en: 'jobs coming soon!', pt: 'trabalhos em breve!' },
  'jobs.subtitle': { en: 'this feature is under development', pt: 'este recurso está em desenvolvimento' },

  // common words used everywhere
  'common.back': { en: 'Back', pt: 'Voltar' },
  'common.save': { en: 'Save', pt: 'Salvar' },
  'common.cancel': { en: 'Cancel', pt: 'Cancelar' },

  // report details screen
'reportDetails.title': { en: 'Report Details', pt: 'Detalhes do Relatório' },
'reportDetails.titleLabel': { en: 'Title', pt: 'Título' },
'reportDetails.dateLabel': { en: 'Date Created', pt: 'Data de Criação' },
'reportDetails.descriptionLabel': { en: 'Description', pt: 'Descrição' },
'reportDetails.noPhoto': { en: 'No photo attached', pt: 'Nenhuma foto anexada' },
'reportDetails.noDescription': { en: 'No description provided', pt: 'Nenhuma descrição fornecida' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // save language to phone storage
  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  // translate function - just pass in a key and get back the translation
  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // load saved language when app starts
  React.useEffect(() => {
    const loadLanguage = async () => {
      const saved = await AsyncStorage.getItem('language');
      if (saved === 'en' || saved === 'pt') {
        setLanguageState(saved);
      }
    };
    loadLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// hook to use language in components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};