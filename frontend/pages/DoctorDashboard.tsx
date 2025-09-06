import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchDialog } from '../components/PatientSearchDialog';
import { AddMedicalRecordDialog } from '../components/AddMedicalRecordDialog';
import { CreateAlertDialog } from '../components/CreateAlertDialog';
import backend from '~backend/client';

export function DoctorDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Patient
            </CardTitle>
            <CardDescription>
              Search for patients using Medical ID or QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowPatientSearch(true)} className="w-full">
              Search Patient
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Add Medical Record
            </CardTitle>
            <CardDescription>
              Add new medical records for patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => selectedPatientId ? handleAddRecord(selectedPatientId) : setShowPatientSearch(true)}
              className="w-full"
              variant="outline"
            >
              Add Record
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Create Alert
            </CardTitle>
            <CardDescription>
              Raise critical alerts to admin for emergency cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => selectedPatientId ? handleCreateAlert(selectedPatientId) : setShowPatientSearch(true)}
              className="w-full"
              variant="destructive"
            >
              Create Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent patient interactions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No recent activity to display.
              </div>
            </CardContent>
          </Card>
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
              <div className="text-center py-8 text-gray-500">
                Search for patients and request access to view them here.
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
              toast({
                title: "Record added",
                description: "Medical record has been added successfully",
              });
            }}
          />

          <CreateAlertDialog
            open={showCreateAlert}
            onOpenChange={setShowCreateAlert}
            patientId={selectedPatientId}
            doctorId={profile?.id || 0}
            onSuccess={() => {
              setShowCreateAlert(false);
              toast({
                title: "Alert created",
                description: "Alert has been sent to admin successfully",
              });
            }}
          />
        </>
      )}
    </div>
  );
}
