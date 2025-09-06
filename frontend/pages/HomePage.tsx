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

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HealthRecord</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
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
              Your Health Records,
              <span className="block text-blue-600">Anytime, Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Secure, digital health record management for migrants and healthcare providers. 
              Access your medical history instantly with a unique Medical ID and QR code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Sign In
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About HealthRecord</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive digital health record system designed to empower patients, 
              support healthcare providers, and ensure seamless medical care continuity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Patient Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Patients have complete control over their medical data, deciding who can access 
                  their records and for how long.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Doctor Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Healthcare providers can request access to patient records and add new medical 
                  information with proper authorization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Admin Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  System administrators monitor critical alerts and ensure the platform 
                  operates smoothly for all users.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need for secure and efficient health record management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Secure Data Storage</CardTitle>
                <CardDescription>
                  Your medical records are encrypted and stored securely with enterprise-grade protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <QrCode className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Unique Medical ID & QR</CardTitle>
                <CardDescription>
                  Each patient gets a unique Medical ID and QR code for instant access to their records
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Doctor Approval Workflow</CardTitle>
                <CardDescription>
                  Doctors must request and receive approval before accessing patient medical records
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload and store medical documents, lab results, prescriptions, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Emergency Alerts</CardTitle>
                <CardDescription>
                  Doctors can raise critical alerts to administrators for emergency situations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Multi-Language Support</CardTitle>
                <CardDescription>
                  Available in English and Hindi, with more languages coming soon
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Get started with your digital health records in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Register Your Account</h3>
              <p className="text-gray-600">
                Sign up as a patient, doctor, or admin. Patients receive a unique Medical ID and QR code.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload & Access Records</h3>
              <p className="text-gray-600">
                Upload medical documents, manage records, and grant access to healthcare providers.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Sharing</h3>
              <p className="text-gray-600">
                Share your Medical ID with doctors for instant access to your health history when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Need Support?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our team is here to help you get the most out of your digital health records. 
              Contact us for assistance or questions.
            </p>
            <Button 
  size="lg" 
  variant="outline" 
  className="border-2 border-white text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-white hover:text-gray-900 shadow-md"
>
  Contact Support
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
              <span className="text-xl font-bold">HealthRecord</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 HealthRecord. All rights reserved.</p>
              <p className="mt-1">Secure digital health records for everyone.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
