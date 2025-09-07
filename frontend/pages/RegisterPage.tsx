import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Heart, ArrowLeft, UserPlus } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';

export function RegisterPage() {
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    license_number: '',
    specialization: '',
    hospital_affiliation: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    address: '',
    allergies: '',
    medical_conditions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('language') === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Password mismatch',
        description: t('passwordMismatch'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('language') === 'hi' ? 'कमज़ोर पासवर्ड' : 'Weak password',
        description: t('weakPassword'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'patient') {
        await backend.health.registerPatient({
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth || undefined,
          gender: formData.gender || undefined,
          blood_type: formData.blood_type || undefined,
          emergency_contact_name: formData.emergency_contact_name || undefined,
          emergency_contact_phone: formData.emergency_contact_phone || undefined,
          address: formData.address || undefined,
          allergies: formData.allergies || undefined,
          medical_conditions: formData.medical_conditions || undefined,
        });
      } else if (role === 'doctor') {
        await backend.health.registerDoctor({
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          license_number: formData.license_number,
          specialization: formData.specialization || undefined,
          hospital_affiliation: formData.hospital_affiliation || undefined,
        });
      } else {
        await backend.health.registerAdmin({
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
        });
      }

      toast({
        title: t('language') === 'hi' ? 'खाता सफलतापूर्वक बनाया गया!' : 'Account created successfully!',
        description: t('language') === 'hi' 
          ? `${t('appName')} में आपका स्वागत है। अब आप अपनी credentials के साथ साइन इन कर सकते हैं।`
          : `Welcome to ${t('appName')}. You can now sign in with your credentials.`,
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: t('language') === 'hi' ? 'रजिस्ट्रेशन असफल' : 'Registration failed',
        description: error.message || (t('language') === 'hi' 
          ? 'खाता बनाने में असफल। कृपया पुन: प्रयास करें।'
          : 'Failed to create account. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
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
              {t('language') === 'hi' ? 'अपना खाता बनाएं' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('language') === 'hi' 
                ? `अपने डिजिटल स्वास्थ्य रिकॉर्ड प्रबंधित करने के लिए ${t('appName')} में शामिल हों`
                : `Join ${t('appName')} to manage your digital health records`
              }
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl">
                <UserPlus className="h-6 w-6 mr-2" />
                {t('register')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('createAccountDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <Label htmlFor="role" className="text-sm font-medium">
                    {t('accountType')}
                  </Label>
                  <Select value={role} onValueChange={(value: 'patient' | 'doctor' | 'admin') => setRole(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('language') === 'hi' ? 'अपनी भूमिका चुनें' : 'Select your role'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">{t('patient')} - {t('patientDescription')}</SelectItem>
                      <SelectItem value="doctor">{t('doctor')} - {t('doctorDescription')}</SelectItem>
                      <SelectItem value="admin">{t('admin')} - {t('adminDescription')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('language') === 'hi' ? 'ईमेल पता' : 'Email Address'} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder={t('language') === 'hi' ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">{t('phoneNumber')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('language') === 'hi' ? 'अपना फोन नंबर दर्ज करें' : 'Enter your phone number'}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t('password')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      placeholder={t('enterPassword')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      {t('confirmPassword')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      placeholder={t('language') === 'hi' ? 'अपने पासवर्ड की पुष्टि करें' : 'Confirm your password'}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Role-specific Fields */}
                {(role === 'patient' || role === 'doctor') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="text-sm font-medium">
                        {t('firstName')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        required
                        placeholder={t('language') === 'hi' ? 'अपना पहला नाम दर्ज करें' : 'Enter your first name'}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-sm font-medium">
                        {t('lastName')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        required
                        placeholder={t('language') === 'hi' ? 'अपना अंतिम नाम दर्ज करें' : 'Enter your last name'}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {role === 'doctor' && (
                  <>
                    <div>
                      <Label htmlFor="license_number" className="text-sm font-medium">
                        {t('language') === 'hi' ? 'मेडिकल लाइसेंस नंबर' : 'Medical License Number'} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="license_number"
                        value={formData.license_number}
                        onChange={(e) => handleInputChange('license_number', e.target.value)}
                        required
                        placeholder={t('language') === 'hi' ? 'अपना मेडिकल लाइसेंस नंबर दर्ज करें' : 'Enter your medical license number'}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specialization" className="text-sm font-medium">{t('specialization')}</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                          placeholder={t('language') === 'hi' ? 'जैसे, कार्डियोलॉजी, बाल चिकित्सा' : 'e.g., Cardiology, Pediatrics'}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hospital_affiliation" className="text-sm font-medium">
                          {t('language') === 'hi' ? 'अस्पताल/क्लिनिक' : 'Hospital/Clinic'}
                        </Label>
                        <Input
                          id="hospital_affiliation"
                          value={formData.hospital_affiliation}
                          onChange={(e) => handleInputChange('hospital_affiliation', e.target.value)}
                          placeholder={t('language') === 'hi' ? 'अस्पताल या क्लिनिक का नाम दर्ज करें' : 'Enter hospital or clinic name'}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {role === 'patient' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date_of_birth" className="text-sm font-medium">{t('dateOfBirth')}</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-sm font-medium">{t('gender')}</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={t('selectGender')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t('male')}</SelectItem>
                            <SelectItem value="female">{t('female')}</SelectItem>
                            <SelectItem value="other">{t('language') === 'hi' ? 'अन्य' : 'Other'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="blood_type" className="text-sm font-medium">{t('bloodType')}</Label>
                        <Select value={formData.blood_type} onValueChange={(value) => handleInputChange('blood_type', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={t('selectBloodType')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency_contact_name" className="text-sm font-medium">
                          {t('language') === 'hi' ? 'आपातकालीन संपर्क नाम' : 'Emergency Contact Name'}
                        </Label>
                        <Input
                          id="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                          placeholder={t('language') === 'hi' ? 'आपातकालीन संपर्क नाम दर्ज करें' : 'Enter emergency contact name'}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency_contact_phone" className="text-sm font-medium">
                          {t('language') === 'hi' ? 'आपातकालीन संपर्क फोन' : 'Emergency Contact Phone'}
                        </Label>
                        <Input
                          id="emergency_contact_phone"
                          type="tel"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                          placeholder={t('language') === 'hi' ? 'आपातकालीन संपर्क फोन दर्ज करें' : 'Enter emergency contact phone'}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">{t('address')}</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder={t('language') === 'hi' ? 'अपना पता दर्ज करें' : 'Enter your address'}
                        rows={2}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="allergies" className="text-sm font-medium">{t('allergies')}</Label>
                        <Textarea
                          id="allergies"
                          value={formData.allergies}
                          onChange={(e) => handleInputChange('allergies', e.target.value)}
                          placeholder={t('language') === 'hi' ? 'कोई एलर्जी सूचीबद्ध करें' : 'List any allergies'}
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medical_conditions" className="text-sm font-medium">{t('medicalConditions')}</Label>
                        <Textarea
                          id="medical_conditions"
                          value={formData.medical_conditions}
                          onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                          placeholder={t('language') === 'hi' ? 'कोई मौजूदा मेडिकल स्थितियां सूचीबद्ध करें' : 'List any existing medical conditions'}
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('language') === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...'}
                    </div>
                  ) : (
                    t('createAccount')
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('language') === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    {t('language') === 'hi' ? 'यहाँ साइन इन करें' : 'Sign in here'}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
