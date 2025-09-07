import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // App Name
    appName: 'MedLink',
    appDescription: 'Digital Health Record System',
    
    // Common
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Patients',
    records: 'Medical Records',
    alerts: 'Alerts',
    profile: 'Profile',
    settings: 'Settings',
    
    // Roles
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Administrator',
    
    // Dashboard
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    totalPatients: 'Total Patients',
    totalRecords: 'Medical Records',
    totalAlerts: 'Alerts Raised',
    pendingRequests: 'Pending Requests',
    recentActivity: 'Recent Activity',
    
    // Medical Records
    addRecord: 'Add Record',
    addMedicalRecord: 'Add Medical Record',
    medicalRecords: 'Medical Records',
    recordTitle: 'Title',
    recordDescription: 'Description',
    recordType: 'Record Type',
    uploadFile: 'Upload File',
    attachFile: 'Attach File',
    noRecords: 'No medical records',
    firstRecord: 'Add First Record',
    
    // Record Types
    prescription: 'Prescription',
    labResult: 'Lab Result',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    vaccination: 'Vaccination',
    other: 'Other',
    
    // Access Requests
    accessRequests: 'Access Requests',
    requestAccess: 'Request Access',
    approveAccess: 'Approve',
    denyAccess: 'Deny',
    accessGranted: 'Access Granted',
    accessDenied: 'Access Denied',
    pending: 'Pending',
    
    // Patient
    patientProfile: 'Patient Profile',
    medicalId: 'Medical ID',
    personalInfo: 'Personal Information',
    emergencyContact: 'Emergency Contact',
    medicalInfo: 'Medical Information',
    allergies: 'Allergies',
    medicalConditions: 'Medical Conditions',
    
    // Alerts
    createAlert: 'Create Alert',
    alertSeverity: 'Severity',
    alertTitle: 'Alert Title',
    alertDescription: 'Description',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    
    // Language
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
  },
  hi: {
    // App Name
    appName: 'मेडलिंक',
    appDescription: 'डिजिटल स्वास्थ्य रिकॉर्ड सिस्टम',
    
    // Common
    login: 'साइन इन',
    register: 'साइन अप',
    logout: 'साइन आउट',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'डिलीट करें',
    edit: 'संपादित करें',
    view: 'देखें',
    download: 'डाउनलोड',
    upload: 'अपलोड',
    search: 'खोजें',
    loading: 'लोड हो रहा है...',
    success: 'सफलता',
    error: 'त्रुटि',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    patients: 'मरीज़',
    records: 'मेडिकल रिकॉर्ड',
    alerts: 'अलर्ट',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    
    // Roles
    patient: 'मरीज़',
    doctor: 'डॉक्टर',
    admin: 'प्रशासक',
    
    // Dashboard
    welcome: 'स्वागत है',
    welcomeBack: 'वापस स्वागत है',
    totalPatients: 'कुल मरीज़',
    totalRecords: 'मेडिकल रिकॉर्ड',
    totalAlerts: 'अलर्ट',
    pendingRequests: 'लंबित अनुरोध',
    recentActivity: 'हाल की गतिविधि',
    
    // Medical Records
    addRecord: 'रिकॉर्ड जोड़ें',
    addMedicalRecord: 'मेडिकल रिकॉर्ड जोड़ें',
    medicalRecords: 'मेडिकल रिकॉर्ड',
    recordTitle: 'शीर्षक',
    recordDescription: 'विवरण',
    recordType: 'रिकॉर्ड प्रकार',
    uploadFile: 'फाइल अपलोड करें',
    attachFile: 'फाइल संलग्न करें',
    noRecords: 'कोई मेडिकल रिकॉर्ड नहीं',
    firstRecord: 'पहला रिकॉर्ड जोड़ें',
    
    // Record Types
    prescription: 'नुस्खा',
    labResult: 'लैब रिपोर्ट',
    diagnosis: 'निदान',
    treatment: 'उपचार',
    vaccination: 'टीकाकरण',
    other: 'अन्य',
    
    // Access Requests
    accessRequests: 'पहुंच अनुरोध',
    requestAccess: 'पहुंच का अनुरोध करें',
    approveAccess: 'अनुमोदन',
    denyAccess: 'अस्वीकार',
    accessGranted: 'पहुंच दी गई',
    accessDenied: 'पहुंच अस्वीकृत',
    pending: 'लंबित',
    
    // Patient
    patientProfile: 'मरीज़ प्रोफाइल',
    medicalId: 'मेडिकल आईडी',
    personalInfo: 'व्यक्तिगत जानकारी',
    emergencyContact: 'आपातकालीन संपर्क',
    medicalInfo: 'मेडिकल जानकारी',
    allergies: 'एलर्जी',
    medicalConditions: 'मेडिकल स्थितियां',
    
    // Alerts
    createAlert: 'अलर्ट बनाएं',
    alertSeverity: 'गंभीरता',
    alertTitle: 'अलर्ट शीर्षक',
    alertDescription: 'विवरण',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'गंभीर',
    
    // Language
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'en' || stored === 'hi')) {
      setLanguage(stored);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
