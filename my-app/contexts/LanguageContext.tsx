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
  'customerDetails.getDirections': { en: 'Get Directions', pt: 'Obter Direções' },
  'customerDetails.contactPerson': { en: 'Contact Person', pt: 'Pessoa de Contato' },
  'customerDetails.activeJobs': { en: 'Active Jobs', pt: 'Trabalhos Ativos' },
  'customerDetails.jobsForCustomer': { en: 'Jobs for this Customer', pt: 'Trabalhos para este Cliente' },
  'customerDetails.noJobs': { en: 'No jobs yet', pt: 'Nenhum trabalho ainda' },
  'customerDetails.scheduled': { en: 'Scheduled', pt: 'Agendado' },

  // add customer screen
  'addCustomer.title': { en: 'Add Customer', pt: 'Adicionar Cliente' },
  'addCustomer.name': { en: 'Customer Name', pt: 'Nome do Cliente' },
  'addCustomer.email': { en: 'Email Address', pt: 'Endereço de E-mail' },
  'addCustomer.phone': { en: 'Phone Number', pt: 'Número de Telefone' },
  'addCustomer.contactPerson': { en: 'Contact Person', pt: 'Pessoa de Contato' },
  'addCustomer.address': { en: 'Address', pt: 'Endereço' },
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

  // report details screen
  'reportDetails.title': { en: 'Report Details', pt: 'Detalhes do Relatório' },
  'reportDetails.titleLabel': { en: 'Title', pt: 'Título' },
  'reportDetails.dateLabel': { en: 'Date Created', pt: 'Data de Criação' },
  'reportDetails.descriptionLabel': { en: 'Description', pt: 'Descrição' },
  'reportDetails.noPhoto': { en: 'No photo attached', pt: 'Nenhuma foto anexada' },
  'reportDetails.noDescription': { en: 'No description provided', pt: 'Nenhuma descrição fornecida' },

  // jobs screen (list)
  'jobs.title': { en: 'Jobs', pt: 'Trabalhos' },
  'jobs.search': { en: 'Search jobs...', pt: 'Buscar trabalhos...' },
  'jobs.filterAll': { en: 'All', pt: 'Todos' },
  'jobs.filterScheduled': { en: 'Scheduled', pt: 'Agendados' },
  'jobs.filterInProgress': { en: 'In Progress', pt: 'Em Andamento' },
  'jobs.filterCompleted': { en: 'Completed', pt: 'Concluídos' },
  'jobs.empty': { en: 'No jobs yet', pt: 'Nenhum trabalho ainda' },
  'jobs.emptyDesc': { en: 'Create your first job to get started', pt: 'Crie seu primeiro trabalho para começar' },

  // add job screen
  'addJob.title': { en: 'Create Job', pt: 'Criar Trabalho' },
  'addJob.jobTitle': { en: 'Job Title', pt: 'Título do Trabalho' },
  'addJob.selectCustomer': { en: 'Select Customer', pt: 'Selecionar Cliente' },
  'addJob.chooseCustomer': { en: 'Choose a customer', pt: 'Escolha um cliente' },
  'addJob.scheduledDate': { en: 'Scheduled Date', pt: 'Data Agendada' },
  'addJob.selectDate': { en: 'Select date', pt: 'Selecionar data' },
  'addJob.location': { en: 'Location', pt: 'Localização' },
  'addJob.description': { en: 'Description', pt: 'Descrição' },
  'addJob.status': { en: 'Status', pt: 'Status' },
  'addJob.save': { en: 'Create Job', pt: 'Criar Trabalho' },
  'addJob.cancel': { en: 'Cancel', pt: 'Cancelar' },

  // edit job screen
  'editJob.title': { en: 'Edit Job', pt: 'Editar Trabalho' },
  'editJob.save': { en: 'Save Changes', pt: 'Salvar Alterações' },

  // job details screen
  'jobDetails.title': { en: 'Job Details', pt: 'Detalhes do Trabalho' },
  'jobDetails.customer': { en: 'Customer', pt: 'Cliente' },
  'jobDetails.scheduledFor': { en: 'Scheduled For', pt: 'Agendado Para' },
  'jobDetails.location': { en: 'Location', pt: 'Localização' },
  'jobDetails.description': { en: 'Description', pt: 'Descrição' },
  'jobDetails.status': { en: 'Status', pt: 'Status' },
  'jobDetails.edit': { en: 'Edit Job', pt: 'Editar Trabalho' },
  'jobDetails.delete': { en: 'Delete Job', pt: 'Excluir Trabalho' },
  'jobDetails.deleteConfirm': { en: 'Are you sure you want to delete this job?', pt: 'Tem certeza que deseja excluir este trabalho?' },
  'jobDetails.noDescription': { en: 'No description provided', pt: 'Nenhuma descrição fornecida' },

  // job statuses
  'status.scheduled': { en: 'Scheduled', pt: 'Agendado' },
  'status.inProgress': { en: 'In Progress', pt: 'Em Andamento' },
  'status.completed': { en: 'Completed', pt: 'Concluído' },

  // job priorities
  'priority.high': { en: 'High Priority', pt: 'Prioridade Alta' },
  'priority.medium': { en: 'Medium Priority', pt: 'Prioridade Média' },
  'priority.low': { en: 'Low Priority', pt: 'Prioridade Baixa' },

  // job card labels
  'jobCard.due': { en: 'Due', pt: 'Vencimento' },
  'jobCard.completed': { en: 'Completed', pt: 'Concluído' },
  'jobCard.daysOverdue': { en: 'days overdue', pt: 'dias atrasado' },
  'jobCard.dueToday': { en: 'Due today', pt: 'Vence hoje' },
  'jobCard.dayLeft': { en: 'day left', pt: 'dia restante' },
  'jobCard.daysLeft': { en: 'days left', pt: 'dias restantes' },

  // settings screen
  'settings.title': { en: 'Settings', pt: 'Configurações' },
  'settings.profile': { en: 'Profile', pt: 'Perfil' },
  'settings.businessOwner': { en: 'Business Owner', pt: 'Proprietário' },
  'settings.language': { en: 'Language', pt: 'Idioma' },
  'settings.english': { en: 'English', pt: 'Inglês' },
  'settings.portuguese': { en: 'Português', pt: 'Português' },
  'settings.dataManagement': { en: 'Data Management', pt: 'Gestão de Dados' },
  'settings.totalCustomers': { en: 'Total Customers', pt: 'Total de Clientes' },
  'settings.totalJobs': { en: 'Total Jobs', pt: 'Total de Trabalhos' },
  'settings.totalReports': { en: 'Total Reports', pt: 'Total de Relatórios' },
  'settings.clearAllData': { en: 'Clear All Data', pt: 'Limpar Todos os Dados' },
  'settings.clearDataConfirm': { en: 'Are you sure you want to delete all customers, jobs, and reports? This action cannot be undone.', pt: 'Tem certeza que deseja excluir todos os clientes, trabalhos e relatórios? Esta ação não pode ser desfeita.' },
  'settings.clearDataSuccess': { en: 'All data has been cleared', pt: 'Todos os dados foram limpos' },
  'settings.errorSavingName': { en: 'Failed to save name', pt: 'Falha ao salvar nome' },
  'settings.errorClearingData': { en: 'Failed to clear data', pt: 'Falha ao limpar dados' },

  // common words used everywhere
  'common.back': { en: 'Back', pt: 'Voltar' },
  'common.save': { en: 'Save', pt: 'Salvar' },
  'common.cancel': { en: 'Cancel', pt: 'Cancelar' },
  'common.delete': { en: 'Delete', pt: 'Excluir' },
  'common.edit': { en: 'Edit', pt: 'Editar' },
  'common.success': { en: 'Success', pt: 'Sucesso' },
  'common.error': { en: 'Error', pt: 'Erro' },
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