import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, FileText, Users, Plus, Download, Eye, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { AddMedicalRecordDialog } from '../components/AddMedicalRecordDialog';
import { AccessRequestDialog } from '../components/AccessRequestDialog';
import { DocumentViewer } from '../components/DocumentViewer';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import backend from '~backend/client';

export function PatientDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAccessRequests, setShowAccessRequests] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);

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

  const handleViewDocument = (record: any) => {
    setSelectedRecord(record);
    setShowDocumentViewer(true);
  };

  const handleDeleteRecord = (record: any) => {
    setRecordToDelete(record);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !profile?.id) return;

    try {
      await backend.health.deleteMedicalRecord({
        record_id: recordToDelete.id,
        user_id: profile.id,
        user_role: 'patient',
      });

      toast({
        title: t('language') === 'hi' ? 'रिकॉर्ड डिलीट किया गया' : 'Record deleted',
        description: t('language') === 'hi' 
          ? 'मेडिकल रिकॉर्ड सफलतापूर्वक डिलीट किया गया है'
          : 'Medical record has been deleted successfully',
      });

      refetchRecords();
      setShowDeleteDialog(false);
      setRecordToDelete(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: t('language') === 'hi' ? 'डिलीट असफल' : 'Delete failed',
        description: error.message || (t('language') === 'hi' ? 'रिकॉर्ड डिलीट करने में असफल' : 'Failed to delete record'),
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (fileName: string, fileUrl?: string) => {
    if (!fileUrl) {
      toast({
        title: "No file attached",
        description: "This record doesn't have an attached file",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await backend.storage.downloadFile({ file_path: fileUrl });
      window.open(response.download_url, '_blank');
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file",
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
    return <Badge variant={variants[status]}>{t(status)}</Badge>;
  };

  const getRecordTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      prescription: "bg-blue-100 text-blue-800",
      lab_result: "bg-green-100 text-green-800",
      diagnosis: "bg-red-100 text-red-800",
      treatment: "bg-purple-100 text-purple-800",
      vaccination: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    };
    
    return (
      <Badge variant="outline" className={colors[type] || colors.other}>
        {t(type.replace('_', ''))}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pendingRequests = accessRequests?.requests.filter(req => req.status === 'pending') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('patient')} {t('dashboard')}</h1>
        <p className="mt-2 text-gray-600">
          {t('welcomeBack')}, {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {medicalRecords?.records.length || 0}
                </p>
                <p className="text-gray-600">{t('medicalRecords')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {accessRequests?.requests.filter(r => r.status === 'approved').length || 0}
                </p>
                <p className="text-gray-600">{t('accessGranted')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <QrCode className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {pendingRequests.length}
                </p>
                <p className="text-gray-600">{t('pendingRequests')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical ID Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <QrCode className="h-5 w-5 mr-2" />
            Your {t('medicalId')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-blue-900 mb-2">
                {profile?.medical_id}
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Show this ID or QR code to healthcare providers for access requests
              </p>
              <Button variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-50">
                <QrCode className="h-4 w-4 mr-2" />
                View QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">{t('medicalRecords')}</TabsTrigger>
          <TabsTrigger value="access">
            {t('accessRequests')}
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {t('medicalRecords')}
                  </CardTitle>
                  <CardDescription>
                    View and manage your medical records and documents with AI-powered summaries
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddRecord(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addRecord')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords?.records.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-lg">{record.title}</h3>
                          {getRecordTypeBadge(record.record_type)}
                          {record.patient_summary && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {t('language') === 'hi' ? 'AI सारांश उपलब्ध' : 'AI Summary Available'}
                            </Badge>
                          )}
                        </div>
                        {record.description && (
                          <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>
                            Created: {new Date(record.created_at).toLocaleDateString()}
                          </span>
                          {record.doctor_name && (
                            <span>Added by: Dr. {record.doctor_name}</span>
                          )}
                          {record.file_name && (
                            <span className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {record.file_name} ({formatFileSize(record.file_size || 0)})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {record.file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadFile(record.file_name || '', record.file_url)}
                            className="flex items-center"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            {t('download')}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewDocument(record)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {t('view')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteRecord(record)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {t('delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {medicalRecords?.records.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noRecords')}</h3>
                    <p className="text-gray-600 mb-4">
                      Get started by adding your first medical record with AI-powered summary
                    </p>
                    <Button onClick={() => setShowAddRecord(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('firstRecord')}
                    </Button>
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
                    {t('accessRequests')}
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
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Dr. {request.doctor_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {getStatusBadge(request.status)}
                          <span className="text-xs text-gray-500">
                            Requested: {new Date(request.requested_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRespondToRequest(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {t('approveAccess')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRespondToRequest(request.id, 'denied')}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {t('denyAccess')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-600">
                      When doctors request access to your records, they'll appear here
                    </p>
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
        userRole="patient"
        onSuccess={() => {
          refetchRecords();
        }}
      />

      <AccessRequestDialog
        open={showAccessRequests}
        onOpenChange={setShowAccessRequests}
        requests={accessRequests?.requests || []}
        onRespond={handleRespondToRequest}
      />

      <DocumentViewer
        open={showDocumentViewer}
        onOpenChange={setShowDocumentViewer}
        record={selectedRecord}
        userRole="patient"
        userId={profile?.id}
        onDelete={() => {
          refetchRecords();
          setShowDocumentViewer(false);
        }}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title={t('language') === 'hi' ? 'रिकॉर्ड डिलीट करें' : 'Delete Record'}
        description={t('language') === 'hi' 
          ? 'क्या आप वाकई इस मेडिकल रिकॉर्ड को डिलीट करना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।'
          : 'Are you sure you want to delete this medical record? This action cannot be undone.'
        }
      />
    </div>
  );
}
