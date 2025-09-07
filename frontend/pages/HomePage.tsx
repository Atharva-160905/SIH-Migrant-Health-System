import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Shield, 
  QrCode, 
  Users, 
  FileText, 
  AlertTriangle, 
  Globe, 
  ChevronRight,
  Stethoscope,
  UserCheck,
  Database
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{t('appName')}</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">{t('about')}</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">{t('features')}</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">{t('howItWorks')}</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">{t('contact')}</a>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600">{t('login')}</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">{t('register')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              {t('language') === 'hi' ? (
                <>
                  आपके स्वास्थ्य रिकॉर्ड,
                  <span className="block text-blue-600">कभी भी, कहीं भी</span>
                </>
              ) : (
                <>
                  Your Health Records,
                  <span className="block text-blue-600">Anytime, Anywhere</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('language') === 'hi' ? (
                'प्रवासियों और स्वास्थ्य सेवा प्रदाताओं के लिए सुरक्षित, डिजिटल स्वास्थ्य रिकॉर्ड प्रबंधन। अपनी मेडिकल हिस्ट्री को एक अनूठी मेडिकल आईडी और QR कोड के साथ तुरंत एक्सेस करें।'
              ) : (
                'Secure, digital health record management for migrants and healthcare providers. Access your medical history instantly with a unique Medical ID and QR code.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  {t('getStarted')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  {t('login')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('language') === 'hi' ? `${t('appName')} के बारे में` : `About ${t('appName')}`}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('language') === 'hi' ? (
                'एक व्यापक डिजिटल स्वास्थ्य रिकॉर्ड सिस्टम जो मरीज़ों को सशक्त बनाने, स्वास्थ्य सेवा प्रदाताओं का समर्थन करने, और निर्बाध चिकित्सा देखभाल निरंतरता सुनिश्चित करने के लिए डिज़ाइन किया गया है।'
              ) : (
                'A comprehensive digital health record system designed to empower patients, support healthcare providers, and ensure seamless medical care continuity.'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">
                  {t('language') === 'hi' ? 'मरीज़ नियंत्रण' : 'Patient Control'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  {t('language') === 'hi' ? (
                    'मरीज़ों का अपने मेडिकल डेटा पर पूरा नियंत्रण होता है, वे तय करते हैं कि कौन उनके रिकॉर्ड तक पहुंच सकता है और कितने समय के लिए।'
                  ) : (
                    'Patients have complete control over their medical data, deciding who can access their records and for how long.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">
                  {t('language') === 'hi' ? 'डॉक्टर पहुंच' : 'Doctor Access'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  {t('language') === 'hi' ? (
                    'स्वास्थ्य सेवा प्रदाता मरीज़ रिकॉर्ड तक पहुंच का अनुरोध कर सकते हैं और उचित प्राधिकरण के साथ नई मेडिकल जानकारी जोड़ सकते हैं।'
                  ) : (
                    'Healthcare providers can request access to patient records and add new medical information with proper authorization.'
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">
                  {t('language') === 'hi' ? 'प्रशासक निगरानी' : 'Admin Monitoring'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  {t('language') === 'hi' ? (
                    'सिस्टम प्रशासक गंभीर अलर्ट की निगरानी करते हैं और सुनिश्चित करते हैं कि प्लेटफॉर्म सभी उपयोगकर्ताओं के लिए सुचारू रूप से काम करे।'
                  ) : (
                    'System administrators monitor critical alerts and ensure the platform operates smoothly for all users.'
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('language') === 'hi' ? 'शक्तिशाली विशेषताएं' : 'Powerful Features'}
            </h2>
            <p className="text-xl text-gray-600">
              {t('language') === 'hi' ? (
                'सुरक्षित और कुशल स्वास्थ्य रिकॉर्ड प्रबंधन के लिए आपको जो कुछ भी चाहिए'
              ) : (
                'Everything you need for secure and efficient health record management'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>
                  {t('language') === 'hi' ? 'सुरक्षित डेटा भंडारण' : 'Secure Data Storage'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'hi' ? (
                    'आपके मेडिकल रिकॉर्ड एंटरप्राइज़-ग्रेड सुरक्षा के साथ एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत हैं'
                  ) : (
                    'Your medical records are encrypted and stored securely with enterprise-grade protection'
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <QrCode className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>
                  {t('language') === 'hi' ? 'अनूठी मेडिकल आईडी और QR' : 'Unique Medical ID & QR'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'hi' ? (
                    'हर मरीज़ को अपने रिकॉर्ड तक तुरंत पहुंच के लिए एक अनूठी मेडिकल आईडी और QR कोड मिलता है'
                  ) : (
                    'Each patient gets a unique Medical ID and QR code for instant access to their records'
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>
                  {t('language') === 'hi' ? 'डॉक्टर अनुमोदन वर्कफ़्लो' : 'Doctor Approval Workflow'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'hi' ? (
                    'डॉक्टरों को मरीज़ मेडिकल रिकॉर्ड तक पहुंचने से पहले अनुरोध करना और अनुमोदन प्राप्त करना होगा'
                  ) : (
                    'Doctors must request and receive approval before accessing patient medical records'
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>
                  {t('language') === 'hi' ? 'दस्तावेज़ अपलोड' : 'Document Upload'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'hi' ? (
                    'मेडिकल दस्तावेज़, लैब परिणाम, नुस्खे और बहुत कुछ अपलोड और स्टोर करें'
                  ) : (
                    'Upload and store medical documents, lab results, prescriptions, and more'
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>
                  {t('language') === 'hi' ? 'आपातकालीन अलर्ट' : 'Emergency Alerts'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'hi' ? (
                    'डॉक्टर आपातकालीन स्थितियों के लिए प्रशासकों को गंभीर अलर्ट भेज सकते हैं'
                  ) : (
                    'Doctors can raise critical alerts to administrators for emergency situations'
                  )}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>
                  {t('language') === 'hi' ? 'बहु-भाषा समर्थन' : 'Multi-Language Support'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'hi' ? (
                    'अंग्रेजी और हिंदी में उपलब्ध, और भी भाषाएं जल्द आ रही हैं'
                  ) : (
                    'Available in English and Hindi, with more languages coming soon'
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('howItWorks')}</h2>
            <p className="text-xl text-gray-600">
              {t('language') === 'hi' ? (
                'तीन आसान चरणों में अपने डिजिटल स्वास्थ्य रिकॉर्ड के साथ शुरुआत करें'
              ) : (
                'Get started with your digital health records in three simple steps'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('language') === 'hi' ? 'अपना खाता रजिस्टर करें' : 'Register Your Account'}
              </h3>
              <p className="text-gray-600">
                {t('language') === 'hi' ? (
                  'मरीज़, डॉक्टर, या प्रशासक के रूप में साइन अप करें। मरीज़ों को एक अनूठी मेडिकल आईडी और QR कोड मिलता है।'
                ) : (
                  'Sign up as a patient, doctor, or admin. Patients receive a unique Medical ID and QR code.'
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('language') === 'hi' ? 'अपलोड और एक्सेस रिकॉर्ड' : 'Upload & Access Records'}
              </h3>
              <p className="text-gray-600">
                {t('language') === 'hi' ? (
                  'मेडिकल दस्तावेज़ अपलोड करें, रिकॉर्ड प्रबंधित करें, और स्वास्थ्य सेवा प्रदाताओं को पहुंच प्रदान करें।'
                ) : (
                  'Upload medical documents, manage records, and grant access to healthcare providers.'
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t('language') === 'hi' ? 'सुरक्षित साझाकरण' : 'Secure Sharing'}
              </h3>
              <p className="text-gray-600">
                {t('language') === 'hi' ? (
                  'जरूरत पड़ने पर अपनी स्वास्थ्य हिस्ट्री तक तुरंत पहुंच के लिए अपनी मेडिकल आईडी डॉक्टरों के साथ साझा करें।'
                ) : (
                  'Share your Medical ID with doctors for instant access to your health history when needed.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              {t('language') === 'hi' ? 'सहायता चाहिए?' : 'Need Support?'}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('language') === 'hi' ? (
                'हमारी टीम आपको अपने डिजिटल स्वास्थ्य रिकॉर्ड का अधिकतम लाभ उठाने में मदद करने के लिए यहां है। सहायता या प्रश्नों के लिए हमसे संपर्क करें।'
              ) : (
                'Our team is here to help you get the most out of your digital health records. Contact us for assistance or questions.'
              )}
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg transition duration-300 
                         bg-gray-900 hover:bg-white hover:text-gray-900 shadow-md"
            >
              {t('language') === 'hi' ? 'सहायता से संपर्क करें' : 'Contact Support'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">{t('appName')}</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 {t('appName')}. {t('language') === 'hi' ? 'सभी अधिकार सुरक्षित।' : 'All rights reserved.'}</p>
              <p className="mt-1">
                {t('language') === 'hi' ? 'सभी के लिए सुरक्षित डिजिटल स्वास्थ्य रिकॉर्ड।' : 'Secure digital health records for everyone.'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
