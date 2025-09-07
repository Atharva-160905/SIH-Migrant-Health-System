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
    close: 'Close',
    approve: 'Approve',
    deny: 'Deny',
    create: 'Create',
    add: 'Add',
    update: 'Update',
    remove: 'Remove',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Patients',
    records: 'Medical Records',
    alerts: 'Alerts',
    profile: 'Profile',
    settings: 'Settings',
    overview: 'Overview',
    actions: 'Actions',
    home: 'Home',
    about: 'About',
    features: 'Features',
    contact: 'Contact',
    
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
    approved: 'Approved',
    denied: 'Denied',
    
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
    
    // Forms
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    bloodType: 'Blood Type',
    address: 'Address',
    male: 'Male',
    female: 'Female',
    specialization: 'Specialization',
    licenseNumber: 'License Number',
    hospitalAffiliation: 'Hospital Affiliation',
    accountType: 'Account Type',
    
    // Messages and Descriptions
    signInDescription: 'Enter your email and password to access your account',
    createAccountDescription: 'Choose your role and fill in the required information',
    patientDescription: 'Manage my health records',
    doctorDescription: 'Access patient records',
    adminDescription: 'System administration',
    
    // File Management
    fileAttached: 'File Attached',
    noFileAttached: 'No file attached',
    selectFile: 'Select file',
    fileSize: 'File size',
    fileName: 'File name',
    attachedDocument: 'Attached Document',
    
    // Placeholders
    enterEmail: 'Enter your email address',
    enterPassword: 'Enter your password',
    enterTitle: 'Enter record title',
    enterDescription: 'Enter record description or notes',
    selectRecordType: 'Select record type',
    selectGender: 'Select gender',
    selectBloodType: 'Select blood type',
    searchPatients: 'Search patients by name or Medical ID...',
    enterMedicalId: 'Enter Medical ID',
    
    // Buttons and Actions
    getStarted: 'Get Started',
    createAccount: 'Create Account',
    signInButton: 'Sign In',
    addFirstRecord: 'Add First Record',
    viewRecords: 'View Records',
    findNewPatient: 'Find New Patient',
    searchByMedicalId: 'Search by Medical ID',
    requestAccessButton: 'Request Access',
    viewInBrowser: 'View in Browser',
    
    // Status and States
    open: 'Open',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    active: 'Active',
    inactive: 'Inactive',
    
    // Time and Dates
    created: 'Created',
    updated: 'Updated',
    requested: 'Requested',
    responded: 'Responded',
    expires: 'Expires',
    
    // Validation and Errors
    required: 'Required',
    optional: 'Optional',
    validationError: 'Validation Error',
    passwordMismatch: 'Passwords do not match',
    weakPassword: 'Password must be at least 6 characters long',
    
    // Empty States
    noData: 'No data available',
    noResults: 'No results found',
    emptyList: 'List is empty',
    
    // Instructions and Help
    howItWorks: 'How It Works',
    instructions: 'Instructions',
    helpText: 'Help',
    
    // Medical Terms
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
    temperature: 'Temperature',
    weight: 'Weight',
    height: 'Height',
    
    // System Messages
    systemMonitoring: 'System Monitoring',
    adminNotes: 'Admin Notes',
    uploadProgress: 'Upload Progress',
    
    // Navigation Links
    backToHome: 'Back to Home',
    viewAllRequests: 'View All Requests',
    
    // Record Management
    uploadDocument: 'Upload Document',
    selectDocument: 'Select Document',
    documentType: 'Document Type',
    
    // Access Control
    accessControl: 'Access Control',
    grantAccess: 'Grant Access',
    revokeAccess: 'Revoke Access',
    
    // Emergency
    emergency: 'Emergency',
    urgent: 'Urgent',
    routine: 'Routine',
    
    // File Types
    pdfDocument: 'PDF Document',
    imageFile: 'Image File',
    document: 'Document',
    
    // Upload Messages
    clickToUpload: 'Click to upload',
    dragAndDrop: 'or drag and drop',
    fileTypeRestriction: 'PDF, PNG, JPG (MAX. 10MB)',
    uploading: 'Uploading...',
    adding: 'Adding...',
    creating: 'Creating...',
    updating: 'Updating...',
    
    // Success Messages
    recordAdded: 'Medical record has been added successfully',
    alertCreated: 'Alert has been sent to admin successfully',
    accessRequestSent: 'Access request sent to patient for approval',
    requestUpdated: 'Access request has been updated',
    alertUpdated: 'Alert status has been updated',
    
    // Error Messages
    fileNotFound: 'File not found',
    downloadFailed: 'Download failed',
    uploadFailed: 'Upload failed',
    patientNotFound: 'Patient not found',
    noAccessPermission: 'No access permission',
    
    // Time Periods
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    
    // Stats
    statistics: 'Statistics',
    analytics: 'Analytics',
    reports: 'Reports',
    
    // Settings
    preferences: 'Preferences',
    configuration: 'Configuration',
    
    // Demo
    demoAccounts: 'Demo Accounts (for testing)',
    testingOnly: 'for testing',
  },
  hi: {
    // App Name
    appName: 'MedLink',
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
    close: 'बंद करें',
    approve: 'स्वीकार करें',
    deny: 'अस्वीकार करें',
    create: 'बनाएं',
    add: 'जोड़ें',
    update: 'अपडेट करें',
    remove: 'हटाएं',
    submit: 'सबमिट करें',
    back: 'वापस',
    next: 'आगे',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    patients: 'मरीज़',
    records: 'मेडिकल रिकॉर्ड',
    alerts: 'अलर्ट',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    overview: 'अवलोकन',
    actions: 'कार्य',
    home: 'होम',
    about: 'हमारे बारे में',
    features: 'विशेषताएं',
    contact: 'संपर्क',
    
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
    approveAccess: 'स्वीकार करें',
    denyAccess: 'अस्वीकार करें',
    accessGranted: 'पहुंच दी गई',
    accessDenied: 'पहुंच अस्वीकृत',
    pending: 'लंबित',
    approved: 'स्वीकृत',
    denied: 'अस्वीकृत',
    
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
    
    // Forms
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    phoneNumber: 'फोन नंबर',
    dateOfBirth: 'जन्म तिथि',
    gender: 'लिंग',
    bloodType: 'रक्त समूह',
    address: 'पता',
    male: 'पुरुष',
    female: 'महिला',
    specialization: 'विशेषज्ञता',
    licenseNumber: 'लाइसेंस नंबर',
    hospitalAffiliation: 'अस्पताल संबद्धता',
    accountType: 'खाता प्रकार',
    
    // Messages and Descriptions
    signInDescription: 'अपने खाते तक पहुंचने के लिए अपना ईमेल और पासवर्ड दर्ज करें',
    createAccountDescription: 'अपनी भूमिका चुनें और आवश्यक जानकारी भरें',
    patientDescription: 'मेरे स्वास्थ्य रिकॉर्ड प्रबंधित करें',
    doctorDescription: 'मरीज़ रिकॉर्ड तक पहुंच',
    adminDescription: 'सिस्टम प्रशासन',
    
    // File Management
    fileAttached: 'फाइल संलग्न',
    noFileAttached: 'कोई फाइल संलग्न नहीं',
    selectFile: 'फाइल चुनें',
    fileSize: 'फाइल का आकार',
    fileName: 'फाइल का नाम',
    attachedDocument: 'संलग्न दस्तावेज़',
    
    // Placeholders
    enterEmail: 'अपना ईमेल पता दर्ज करें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    enterTitle: 'रिकॉर्ड शीर्षक दर्ज करें',
    enterDescription: 'रिकॉर्ड विवरण या नोट्स दर्ज करें',
    selectRecordType: 'रिकॉर्ड प्रकार चुनें',
    selectGender: 'लिंग चुनें',
    selectBloodType: 'रक्त समूह चुनें',
    searchPatients: 'नाम या मेडिकल आईडी से मरीज़ खोजें...',
    enterMedicalId: 'मेडिकल आईडी दर्ज करें',
    
    // Buttons and Actions
    getStarted: 'शुरू करें',
    createAccount: 'खाता बनाएं',
    signInButton: 'साइन इन',
    addFirstRecord: 'पहला रिकॉर्ड जोड़ें',
    viewRecords: 'रिकॉर्ड देखें',
    findNewPatient: 'नया मरीज़ खोजें',
    searchByMedicalId: 'मेडिकल आईडी से खोजें',
    requestAccessButton: 'पहुंच का अनुरोध करें',
    viewInBrowser: 'ब्राउज़र में देखें',
    
    // Status and States
    open: 'खुला',
    inProgress: 'प्रगति में',
    resolved: 'हल किया गया',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    
    // Time and Dates
    created: 'बनाया गया',
    updated: 'अपडेट किया गया',
    requested: 'अनुरोध किया गया',
    responded: 'जवाब दिया गया',
    expires: 'समाप्त होता है',
    
    // Validation and Errors
    required: 'आवश्यक',
    optional: 'वैकल्पिक',
    validationError: 'सत्यापन त्रुटि',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    weakPassword: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    
    // Empty States
    noData: 'कोई डेटा उपलब्ध नहीं',
    noResults: 'कोई परिणाम नहीं मिला',
    emptyList: 'सूची खाली है',
    
    // Instructions and Help
    howItWorks: 'यह कैसे काम करता है',
    instructions: 'निर्देश',
    helpText: 'सहायता',
    
    // Medical Terms
    bloodPressure: 'रक्तचाप',
    heartRate: 'हृदय गति',
    temperature: 'तापमान',
    weight: 'वजन',
    height: 'ऊंचाई',
    
    // System Messages
    systemMonitoring: 'सिस्टम मॉनिटरिंग',
    adminNotes: 'प्रशासक नोट्स',
    uploadProgress: 'अपलोड प्रगति',
    
    // Navigation Links
    backToHome: 'होम पर वापस',
    viewAllRequests: 'सभी अनुरोध देखें',
    
    // Record Management
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    selectDocument: 'दस्तावेज़ चुनें',
    documentType: 'दस्तावेज़ प्रकार',
    
    // Access Control
    accessControl: 'पहुंच नियंत्रण',
    grantAccess: 'पहुंच प्रदान करें',
    revokeAccess: 'पहुंच रद्द करें',
    
    // Emergency
    emergency: 'आपातकाल',
    urgent: 'अत्यावश्यक',
    routine: 'नियमित',
    
    // File Types
    pdfDocument: 'पीडीएफ दस्तावेज़',
    imageFile: 'छवि फाइल',
    document: 'दस्तावेज़',
    
    // Upload Messages
    clickToUpload: 'अपलोड करने के लिए क्लिक करें',
    dragAndDrop: 'या ड्रैग और ड्रॉप करें',
    fileTypeRestriction: 'PDF, PNG, JPG (अधिकतम 10MB)',
    uploading: 'अपलोड हो रहा है...',
    adding: 'जोड़ा जा रहा है...',
    creating: 'बनाया जा रहा है...',
    updating: 'अपडेट हो रहा है...',
    
    // Success Messages
    recordAdded: 'मेडिकल रिकॉर्ड सफलतापूर्वक जोड़ा गया है',
    alertCreated: 'अलर्ट प्रशासक को सफलतापूर्वक भेजा गया है',
    accessRequestSent: 'पहुंच अनुरोध मरीज़ को अनुमोदन के लिए भेजा गया',
    requestUpdated: 'पहुंच अनुरोध अपडेट किया गया है',
    alertUpdated: 'अलर्ट स्थिति अपडेट की गई है',
    
    // Error Messages
    fileNotFound: 'फाइल नहीं मिली',
    downloadFailed: 'डाउनलोड असफल',
    uploadFailed: 'अपलोड असफल',
    patientNotFound: 'मरीज़ नहीं मिला',
    noAccessPermission: 'पहुंच की अनुमति नहीं',
    
    // Time Periods
    today: 'आज',
    yesterday: 'कल',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    
    // Stats
    statistics: 'आंकड़े',
    analytics: 'विश्लेषण',
    reports: 'रिपोर्ट',
    
    // Settings
    preferences: 'प्राथमिकताएं',
    configuration: 'कॉन्फ़िगरेशन',
    
    // Demo
    demoAccounts: 'डेमो खाते (परीक्षण के लिए)',
    testingOnly: 'परीक्षण के लिए',
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
