import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Heart, ArrowLeft } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: t('language') === 'hi' ? 'वापस स्वागत है!' : 'Welcome back!',
        description: t('language') === 'hi' 
          ? 'आप सफलतापूर्वक साइन इन हो गए हैं'
          : 'You have been signed in successfully',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: t('language') === 'hi' ? 'साइन इन असफल' : 'Sign in failed',
        description: error.message || (t('language') === 'hi' ? 'अमान्य ईमेल या पासवर्ड' : 'Invalid email or password'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-500">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToHome')}
              </Link>
              <LanguageToggle />
            </div>
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <Heart className="h-10 w-10 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{t('appName')}</span>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t('welcomeBack')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('language') === 'hi' 
                ? 'अपने स्वास्थ्य रिकॉर्ड तक पहुंचने के लिए साइन इन करें'
                : 'Sign in to access your health records'
              }
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('login')}</CardTitle>
              <CardDescription className="text-center">
                {t('signInDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('language') === 'hi' ? 'ईमेल पता' : 'Email Address'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('enterEmail')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('enterPassword')}
                    className="mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('language') === 'hi' ? 'साइन इन हो रहे हैं...' : 'Signing in...'}
                    </div>
                  ) : (
                    t('login')
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('language') === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    {t('language') === 'hi' ? 'यहाँ बनाएं' : 'Create one here'}
                  </Link>
                </p>
              </div>

              {/* Demo Accounts */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center mb-2">
                  {t('demoAccounts')}
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>{t('patient')}: patient@demo.com / password</div>
                  <div>{t('doctor')}: doctor@demo.com / password</div>
                  <div>{t('admin')}: admin@demo.com / password</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
