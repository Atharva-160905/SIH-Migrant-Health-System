import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  FileText, 
  Plus, 
  Download, 
  AlertTriangle, 
  Calendar,
  Phone,
  MapPin,
  Heart,
  Shield,
  Eye,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { AddMedicalRecordDialog } from './AddMedicalRecordDialog';
import { CreateAlertDialog } from './CreateAlertDialog';
import { DocumentViewer } from './DocumentViewer';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import backend from '~backend/client';

interface Patient {
  id: number;
  medical_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  gender?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  allergies?: string;
  medical_conditions?: string;
  access_granted_at: Date;
  access_expires_at?: Date;
}

interface PatientRecordViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  doctorId: number;
}

export function PatientRecordView({
  open,
  onOpenChange,
  patient,
  doctorId,
}: PatientRecordViewProps) {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: medicalRecords, refetch: refetchRecords } = useQuery({
    queryKey: ['medical-records', patient?.id],
    queryFn: () => patient?.id ? backend.health.listMedicalRecords({ patient_id: patient.id }) : null,
    enabled: !!patient?.id && open,
  });

  const handleViewDocument = (record: any) => {
    setSelectedRecord(record);
    setShowDocumentViewer(true);
  };

  const handleDeleteRecord = (record: any) => {
    setRecordToDelete(record);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await backend.health.deleteMedicalRecord({
        record_id: recordToDelete.id,
        user_id: doctorId,
        user_role: 'doctor',
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

  const handleGenerateCombinedSummary = async () => {
    if (!medicalRecords?.records.length) {
      toast({
        title: t('language') === 'hi' ? 'कोई दस्तावेज़ नहीं' : 'No documents',
        description: t('language') === 'hi' 
          ? 'संयुक्त सारांश तैयार करने के लिए कम से कम एक दस्तावेज़ होना चाहिए'
          : 'At least one document is required to generate a combined summary',
        variant: "destructive",
      });
      return;
    }

    const recordsWithFiles = medicalRecords.records.filter(record => record.file_url);
    
    if (recordsWithFiles.length === 0) {
      toast({
        title: t('language') === 'hi' ? 'कोई फाइल नहीं' : 'No files',
        description: t('language') === 'hi' 
          ? 'संयुक्त सारांश तैयार करने के लिए फाइल वाले दस्तावेज़ होने चाहिए'
          : 'Documents with files are required to generate a combined summary',
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const response = await backend.ai.summarizeAllDocuments({
        file_paths: recordsWithFiles.map(record => record.file_url!),
        document_titles: recordsWithFiles.map(record => record.title),
      });

      // Show the combined summary in a dialog or toast
      toast({
        title: t('language') === 'hi' ? 'संयुक्त सारांश तैयार' : 'Combined Summary Generated',
        description: t('language') === 'hi' 
          ? 'सभी दस्तावेज़ों का संयुक्त सारांश तैयार किया गया है'
          : 'Combined summary of all documents has been generated',
      });

      // You can display this in a modal or separate view
      console.log('Combined Summary:', response.combined_summary);
      
    } catch (error: any) {
      console.error('Combined summary error:', error);
      toast({
        title: t('language') === 'hi' ? 'सारांश त्रुटि' : 'Summary Error',
        description: error.message || (t('language') === 'hi' ? 'संयुक्त सारांश तैयार करने में असफल' : 'Failed to generate combined summary'),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
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

  if (!patient) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              {patient.first_name} {patient.last_name}
            </DialogTitle>
            <DialogDescription>
              {t('medicalId')}: {patient.medical_id} • Access granted on {new Date(patient.access_granted_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('patient')} Overview</TabsTrigger>
              <TabsTrigger value="records">{t('medicalRecords')}</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {t('personalInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Date of Birth:</span>
                        <p>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Gender:</span>
                        <p>{patient.gender || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Blood Type:</span>
                        <p className="flex items-center">
                          {patient.blood_type ? (
                            <>
                              <Heart className="h-4 w-4 mr-1 text-red-500" />
                              {patient.blood_type}
                            </>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      {t('emergencyContact')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Name:</span>
                      <p>{patient.emergency_contact_name || 'Not provided'}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <p>{patient.emergency_contact_phone || 'Not provided'}</p>
                    </div>
                  </CardContent>
                </Card>

                {patient.address && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{patient.address}</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      {t('medicalInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">{t('allergies')}:</span>
                      <p className="mt-1 p-2 bg-red-50 rounded border border-red-200">
                        {patient.allergies || 'No known allergies'}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">{t('medicalConditions')}:</span>
                      <p className="mt-1 p-2 bg-yellow-50 rounded border border-yellow-200">
                        {patient.medical_conditions || 'No known conditions'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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
                        View all medical records for this patient
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleGenerateCombinedSummary}
                        disabled={isGeneratingSummary}
                        variant="outline"
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                      >
                        {isGeneratingSummary ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent mr-2"></div>
                            {t('language') === 'hi' ? 'तैयार हो रहा है...' : 'Generating...'}
                          </div>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {t('language') === 'hi' ? 'सभी दस्तावेज़ों का सारांश' : 'Summary of All Documents'}
                          </>
                        )}
                      </Button>
                      <Button onClick={() => setShowAddRecord(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('addRecord')}
                      </Button>
                    </div>
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
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(record.created_at).toLocaleDateString()}
                              </Badge>
                              {record.doctor_summary && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  {t('language') === 'hi' ? 'AI सारांश' : 'AI Summary'}
                                </Badge>
                              )}
                            </div>
                            {record.description && (
                              <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
                            {record.doctor_id === doctorId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteRecord(record)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                {t('delete')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {medicalRecords?.records.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
                        <p className="text-gray-600 mb-4">
                          No medical records have been added for this patient yet
                        </p>
                        <Button onClick={() => setShowAddRecord(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Record
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowAddRecord(true)}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{t('addMedicalRecord')}</CardTitle>
                    <CardDescription>
                      Upload new medical documents, prescriptions, or test results with AI-powered summaries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setShowAddRecord(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('addRecord')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowCreateAlert(true)}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{t('createAlert')}</CardTitle>
                    <CardDescription>
                      Raise critical alerts to admin for emergency cases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setShowCreateAlert(true)} 
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {t('createAlert')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddMedicalRecordDialog
        open={showAddRecord}
        onOpenChange={setShowAddRecord}
        patientId={patient.id}
        doctorId={doctorId}
        userRole="doctor"
        onSuccess={() => {
          refetchRecords();
          setShowAddRecord(false);
        }}
      />

      <CreateAlertDialog
        open={showCreateAlert}
        onOpenChange={setShowCreateAlert}
        patientId={patient.id}
        doctorId={doctorId}
        onSuccess={() => {
          setShowCreateAlert(false);
        }}
      />

      <DocumentViewer
        open={showDocumentViewer}
        onOpenChange={setShowDocumentViewer}
        record={selectedRecord}
        userRole="doctor"
        userId={doctorId}
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
    </>
  );
}
