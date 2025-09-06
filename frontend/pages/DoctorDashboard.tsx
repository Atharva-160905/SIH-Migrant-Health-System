import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, FileText, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PatientSearchDialog } from '../components/PatientSearchDialog';
import { AddMedicalRecordDialog } from '../components/AddMedicalRecordDialog';
import { CreateAlertDialog } from '../components/CreateAlertDialog';

export function DoctorDashboard() {
  const { profile } = useAuth();
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
    setShowPatientSearch(false);
  };

  const handleAddRecord = (patientId: number) => {
    setSelectedPatientId(patientId);
    setShowAddRecord(true);
  };

  const handleCreateAlert = (patientId: number) => {
    setSelectedPatientId(patientId);
    setShowCreateAlert(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome, Dr. {profile?.first_name} {profile?.last_name}
        </p>
        {profile?.specialization && (
          <p className="text-sm text-gray-500">
            Specialization: {profile.specialization}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Records Added</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Active Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Alerts Raised</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowPatientSearch(true)}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Search Patient</CardTitle>
            <CardDescription>
              Search for patients using Medical ID or QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowPatientSearch(true)} className="w-full bg-blue-600 hover:bg-blue-700">
              Search Patient
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Add Medical Record</CardTitle>
            <CardDescription>
              Add new medical records for patients with access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => selectedPatientId ? handleAddRecord(selectedPatientId) : setShowPatientSearch(true)}
              className="w-full bg-green-600 hover:bg-green-700"
              variant="outline"
            >
              Add Record
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Create Alert</CardTitle>
            <CardDescription>
              Raise critical alerts to admin for emergency cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => selectedPatientId ? handleCreateAlert(selectedPatientId) : setShowPatientSearch(true)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Create Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Summary
                </CardTitle>
                <CardDescription>
                  Your recent activity and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Records Added This Week</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Alerts Raised</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Patient Consultations</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
                <CardDescription>
                  Best practices for using the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Always request patient access before attempting to view medical records
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Upload supporting documents when adding medical records
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      Use alerts for critical cases that require immediate admin attention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patients with Access</CardTitle>
              <CardDescription>
                Patients who have granted you access to their medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
                <p className="text-gray-600 mb-4">
                  Search for patients and request access to view them here
                </p>
                <Button onClick={() => setShowPatientSearch(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search Patients
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent patient interactions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600">
                  Your recent actions and patient interactions will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PatientSearchDialog
        open={showPatientSearch}
        onOpenChange={setShowPatientSearch}
        doctorId={profile?.id || 0}
        onPatientSelect={handlePatientSelect}
        onAddRecord={handleAddRecord}
        onCreateAlert={handleCreateAlert}
      />

      {selectedPatientId && (
        <>
          <AddMedicalRecordDialog
            open={showAddRecord}
            onOpenChange={setShowAddRecord}
            patientId={selectedPatientId}
            doctorId={profile?.id}
            onSuccess={() => {
              setShowAddRecord(false);
            }}
          />

          <CreateAlertDialog
            open={showCreateAlert}
            onOpenChange={setShowCreateAlert}
            patientId={selectedPatientId}
            doctorId={profile?.id || 0}
            onSuccess={() => {
              setShowCreateAlert(false);
            }}
          />
        </>
      )}
    </div>
  );
}
