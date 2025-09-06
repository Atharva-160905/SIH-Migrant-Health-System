import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, FileText, Users, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { AddMedicalRecordDialog } from '../components/AddMedicalRecordDialog';
import { AccessRequestDialog } from '../components/AccessRequestDialog';
import backend from '~backend/client';

export function PatientDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAccessRequests, setShowAccessRequests] = useState(false);

  const { data: medicalRecords, refetch: refetchRecords } = useQuery({
    queryKey: ['medical-records', profile?.id],
    queryFn: () => profile?.id ? backend.health.listMedicalRecords({ patient_id: profile.id }) : null,
    enabled: !!profile?.id,
  });

  const { data: accessRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['access-requests', profile?.id],
    queryFn: () => profile?.id ? backend.health.listAccessRequests({ patient_id: profile.id }) : null,
    enabled: !!profile?.id,
  });

  const handleRespondToRequest = async (requestId: number, status: 'approved' | 'denied') => {
    try {
      await backend.health.respondAccessRequest({ request_id: requestId, status });
      toast({
        title: "Request updated",
        description: `Access request ${status}`,
      });
      refetchRequests();
    } catch (error: any) {
      console.error('Error responding to request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      denied: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      {/* Medical ID Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Your Medical ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-blue-900 mb-2">
                {profile?.medical_id}
              </div>
              <p className="text-sm text-blue-700">
                Show this ID or QR code to healthcare providers for access requests
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="access">Access Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Medical Records
                  </CardTitle>
                  <CardDescription>
                    View and manage your medical records
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddRecord(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords?.records.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Badge variant="outline" className="mr-2">
                            {record.record_type}
                          </Badge>
                          {record.doctor_name && (
                            <span>Added by: {record.doctor_name}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {medicalRecords?.records.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No medical records found. Add your first record to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Access Requests
                  </CardTitle>
                  <CardDescription>
                    Manage doctor access requests to your medical records
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setShowAccessRequests(true)}>
                  View All Requests
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessRequests?.requests
                  .filter(req => req.status === 'pending')
                  .map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Dr. {request.doctor_name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                          <div className="mt-2">
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleRespondToRequest(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRespondToRequest(request.id, 'denied')}
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {accessRequests?.requests.filter(req => req.status === 'pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No pending access requests.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddMedicalRecordDialog
        open={showAddRecord}
        onOpenChange={setShowAddRecord}
        patientId={profile?.id || 0}
        onSuccess={() => {
          refetchRecords();
          setShowAddRecord(false);
        }}
      />

      <AccessRequestDialog
        open={showAccessRequests}
        onOpenChange={setShowAccessRequests}
        requests={accessRequests?.requests || []}
        onRespond={handleRespondToRequest}
      />
    </div>
  );
}
