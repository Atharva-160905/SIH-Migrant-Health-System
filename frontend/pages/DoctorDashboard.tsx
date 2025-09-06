import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Search, 
  Users, 
  FileText, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Calendar,
  Clock,
  Phone,
  Mail,
  Stethoscope,
  Hospital
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchDialog } from '../components/PatientSearchDialog';
import { PatientRecordView } from '../components/PatientRecordView';
import backend from '~backend/client';

export function DoctorDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showPatientRecord, setShowPatientRecord] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch doctor stats
  const { data: doctorStats } = useQuery({
    queryKey: ['doctor-stats', profile?.id],
    queryFn: () => profile?.id ? backend.health.getDoctorStats({ doctor_id: profile.id }) : null,
    enabled: !!profile?.id,
  });

  // Fetch patients with access
  const { data: patientRecords } = useQuery({
    queryKey: ['patient-records', profile?.id],
    queryFn: () => profile?.id ? backend.health.listPatientRecords({ doctor_id: profile.id }) : null,
    enabled: !!profile?.id,
  });

  // Fetch access requests made by doctor
  const { data: accessRequests } = useQuery({
    queryKey: ['access-requests-by-doctor', profile?.id],
    queryFn: () => profile?.id ? backend.health.listAccessRequestsByDoctor({ doctor_id: profile.id }) : null,
    enabled: !!profile?.id,
  });

  const handlePatientSelect = (patientId: number) => {
    const patient = patientRecords?.patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setShowPatientRecord(true);
    }
    setShowPatientSearch(false);
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientRecord(true);
  };

  const filteredPatients = patientRecords?.patients.filter(patient =>
    patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.medical_id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      denied: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'record_added':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'alert_raised':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'access_granted':
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'record_added':
        return `Added "${activity.description}" for ${activity.patient_name}`;
      case 'alert_raised':
        return `Raised alert: "${activity.description}" for ${activity.patient_name}`;
      case 'access_granted':
        return `Access granted by ${activity.patient_name}`;
      default:
        return activity.description;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, Dr. {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="patients">Patient Records</TabsTrigger>
          <TabsTrigger value="search">Search Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {/* Doctor Profile */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <User className="h-6 w-6 mr-2" />
                Doctor Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-blue-800">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    <span className="font-medium">Dr. {profile?.first_name} {profile?.last_name}</span>
                  </div>
                  {profile?.specialization && (
                    <div className="flex items-center text-blue-700">
                      <Activity className="h-4 w-4 mr-2" />
                      <span>Specialization: {profile.specialization}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>License: {profile?.license_number}</span>
                  </div>
                  {profile?.hospital_affiliation && (
                    <div className="flex items-center text-blue-700">
                      <Hospital className="h-4 w-4 mr-2" />
                      <span>{profile.hospital_affiliation}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {doctorStats?.stats.total_patients || 0}
                    </p>
                    <p className="text-gray-600">Patients Treated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {doctorStats?.stats.total_records_added || 0}
                    </p>
                    <p className="text-gray-600">Records Added</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {doctorStats?.stats.total_alerts_raised || 0}
                    </p>
                    <p className="text-gray-600">Alerts Raised</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent patient interactions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {doctorStats?.stats.recent_activity.length ? (
                <div className="space-y-4">
                  {doctorStats.stats.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {getActivityText(activity)}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(activity.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-600">
                    Your recent actions and patient interactions will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    My Patients
                  </CardTitle>
                  <CardDescription>
                    Patients who have granted you access to their records
                  </CardDescription>
                </div>
                <Button onClick={() => setShowPatientSearch(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Find New Patient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search patients by name or Medical ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Patient List */}
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewPatient(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {patient.first_name} {patient.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">Medical ID: {patient.medical_id}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
                          {patient.date_of_birth && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                            </div>
                          )}
                          {patient.gender && (
                            <div>Gender: {patient.gender}</div>
                          )}
                          {patient.blood_type && (
                            <div>Blood: {patient.blood_type}</div>
                          )}
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Access: {new Date(patient.access_granted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Records
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchQuery ? 'No patients found' : 'No patients yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery 
                        ? 'Try adjusting your search terms'
                        : 'Search for patients and request access to view them here'
                      }
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowPatientSearch(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Search className="h-4 w-4 mr-2" />
                        Search Patients
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <div className="grid gap-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search New Patients
                </CardTitle>
                <CardDescription>
                  Find patients by Medical ID to request access to their records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowPatientSearch(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search by Medical ID
                </Button>
              </CardContent>
            </Card>

            {/* Access Requests History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Access Requests History
                </CardTitle>
                <CardDescription>
                  View all access requests you've made and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessRequests?.requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{request.patient_name}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          {request.reason && (
                            <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Requested: {new Date(request.requested_at).toLocaleDateString()}
                            </span>
                            {request.responded_at && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Responded: {new Date(request.responded_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {request.status === 'approved' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const patient = patientRecords?.patients.find(p => p.id === request.patient_id);
                              if (patient) handleViewPatient(patient);
                            }}
                          >
                            View Records
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {accessRequests?.requests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No access requests</h3>
                      <p className="text-gray-600 mb-4">
                        You haven't made any access requests yet
                      </p>
                      <Button onClick={() => setShowPatientSearch(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Search className="h-4 w-4 mr-2" />
                        Search Your First Patient
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <PatientSearchDialog
        open={showPatientSearch}
        onOpenChange={setShowPatientSearch}
        doctorId={profile?.id || 0}
        onPatientSelect={handlePatientSelect}
        onAddRecord={() => {}}
        onCreateAlert={() => {}}
      />

      <PatientRecordView
        open={showPatientRecord}
        onOpenChange={setShowPatientRecord}
        patient={selectedPatient}
        doctorId={profile?.id || 0}
      />
    </div>
  );
}
