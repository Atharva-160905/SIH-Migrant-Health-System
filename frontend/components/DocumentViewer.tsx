import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, X, Eye, ExternalLink, Sparkles, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import backend from '~backend/client';

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: {
    id: number;
    title: string;
    description?: string;
    record_type: string;
    file_url?: string;
    file_name?: string;
    file_size?: number;
    patient_summary?: string;
    doctor_summary?: string;
    summary_generated_at?: Date;
    created_at: Date;
    doctor_name?: string;
  } | null;
  userRole?: 'patient' | 'doctor';
  userId?: number;
  onDelete?: () => void;
}

export function DocumentViewer({ 
  open, 
  onOpenChange, 
  record, 
  userRole = 'patient',
  userId,
  onDelete,
}: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDownload = async () => {
    if (!record?.file_url) {
      toast({
        title: t('language') === 'hi' ? 'कोई फाइल संलग्न नहीं' : 'No file attached',
        description: t('language') === 'hi' 
          ? 'इस रिकॉर्ड में कोई संलग्न फाइल नहीं है'
          : "This record doesn't have an attached file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.storage.downloadFile({ file_path: record.file_url });
      window.open(response.download_url, '_blank');
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: t('downloadFailed'),
        description: error.message || (t('language') === 'hi' ? 'फाइल डाउनलोड करने में असफल' : 'Failed to download file'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInBrowser = async () => {
    if (!record?.file_url) {
      toast({
        title: t('language') === 'hi' ? 'कोई फाइल संलग्न नहीं' : 'No file attached',
        description: t('language') === 'hi' 
          ? 'इस रिकॉर्ड में कोई संलग्न फाइल नहीं है'
          : "This record doesn't have an attached file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.storage.downloadFile({ file_path: record.file_url });
      window.open(response.download_url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      console.error('View error:', error);
      toast({
        title: t('language') === 'hi' ? 'देखने में असफल' : 'View failed',
        description: error.message || (t('language') === 'hi' ? 'फाइल देखने में असफल' : 'Failed to view file'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record || !userId) return;

    try {
      await backend.health.deleteMedicalRecord({
        record_id: record.id,
        user_id: userId,
        user_role: userRole,
      });

      toast({
        title: t('language') === 'hi' ? 'रिकॉर्ड डिलीट किया गया' : 'Record deleted',
        description: t('language') === 'hi' 
          ? 'मेडिकल रिकॉर्ड सफलतापूर्वक डिलीट किया गया है'
          : 'Medical record has been deleted successfully',
      });

      onDelete?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: t('language') === 'hi' ? 'डिलीट असफल' : 'Delete failed',
        description: error.message || (t('language') === 'hi' ? 'रिकॉर्ड डिलीट करने में असफल' : 'Failed to delete record'),
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

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const isImageFile = (fileName: string): boolean => {
    const ext = getFileExtension(fileName);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  const isPdfFile = (fileName: string): boolean => {
    const ext = getFileExtension(fileName);
    return ext === 'pdf';
  };

  const renderAISummary = (summary: string, type: 'patient' | 'doctor') => {
    if (!summary) return null;

    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Sparkles className="h-5 w-5 mr-2" />
            {type === 'patient' 
              ? (t('language') === 'hi' ? 'AI सारांश (मरीज़ के लिए)' : 'AI Summary (For Patient)')
              : (t('language') === 'hi' ? 'AI सारांश (डॉक्टर के लिए)' : 'AI Summary (For Doctor)')
            }
          </CardTitle>
          <CardDescription>
            {type === 'patient' 
              ? (t('language') === 'hi' ? 'आपको समझने में मदद के लिए सरल भाषा में सारांश' : 'Summary in simple language to help you understand')
              : (t('language') === 'hi' ? 'चिकित्सा पेशेवरों के लिए तकनीकी सारांश' : 'Technical summary for medical professionals')
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {summary}
            </div>
          </div>
          {type === 'patient' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium">
                {t('language') === 'hi' 
                  ? '⚠️ महत्वपूर्ण: यह सारांश केवल समझने के लिए है। उचित चिकित्सा सलाह और उपचार के लिए हमेशा अपने डॉक्टर से सलाह लें।'
                  : '⚠️ Important: This summary is for understanding only. Always consult with your doctor for proper medical advice and treatment.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!record) return null;

  const relevantSummary = userRole === 'patient' ? record.patient_summary : record.doctor_summary;
  const hasSummary = !!(record.patient_summary || record.doctor_summary);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {record.title}
            </DialogTitle>
            <DialogDescription>
              {t('medicalRecords')} - {new Date(record.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Record Details */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getRecordTypeBadge(record.record_type)}
                  <span className="text-sm text-gray-600">
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>
                  {hasSummary && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('language') === 'hi' ? 'AI सारांश उपलब्ध' : 'AI Summary Available'}
                    </Badge>
                  )}
                </div>
                
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t('delete')}
                  </Button>
                )}
              </div>
              
              {record.description && (
                <p className="text-sm text-gray-700 mb-3">{record.description}</p>
              )}
              
              {record.doctor_name && (
                <p className="text-xs text-gray-500">
                  {t('language') === 'hi' ? 'द्वारा जोड़ा गया: डॉ.' : 'Added by: Dr.'} {record.doctor_name}
                </p>
              )}
            </div>

            {/* AI Summary and File Tabs */}
            <Tabs defaultValue={hasSummary ? "summary" : "document"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary" disabled={!hasSummary}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('language') === 'hi' ? 'AI सारांश' : 'AI Summary'}
                </TabsTrigger>
                <TabsTrigger value="document">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('language') === 'hi' ? 'मूल दस्तावेज़' : 'Original Document'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                {relevantSummary ? (
                  renderAISummary(relevantSummary, userRole)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('language') === 'hi' ? 'AI सारांश उपलब्ध नहीं' : 'AI Summary Not Available'}
                    </h3>
                    <p className="text-gray-600">
                      {t('language') === 'hi' 
                        ? 'इस दस्तावेज़ के लिए कोई AI सारांश तैयार नहीं किया गया है'
                        : 'No AI summary has been generated for this document'
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="document">
                {/* File Information */}
                {record.file_url && record.file_name ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('attachedDocument')}
                      </h3>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">{record.file_name}</p>
                            <p className="text-sm text-blue-700">
                              {formatFileSize(record.file_size || 0)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button
                          onClick={handleViewInBrowser}
                          disabled={isLoading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              {t('loading')}
                            </div>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('viewInBrowser')}
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={handleDownload}
                          disabled={isLoading}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t('download')}
                        </Button>
                      </div>

                      {/* File Type Specific Instructions */}
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          {isPdfFile(record.file_name) ? (
                            t('language') === 'hi' ? (
                              <>
                                <strong>PDF दस्तावेज़:</strong> आसान पढ़ने के लिए नए टैब में PDF खोलने के लिए "ब्राउज़र में देखें" पर क्लिक करें। 
                                आप ज़ूम, खोज, और पेजों के बीच नेविगेट कर सकते हैं।
                              </>
                            ) : (
                              <>
                                <strong>PDF Document:</strong> Click "View in Browser" to open the PDF in a new tab for easy reading. 
                                You can zoom, search, and navigate through pages.
                              </>
                            )
                          ) : isImageFile(record.file_name) ? (
                            t('language') === 'hi' ? (
                              <>
                                <strong>छवि फाइल:</strong> नए टैब में पूर्ण आकार की छवि देखने के लिए "ब्राउज़र में देखें" पर क्लिक करें।
                              </>
                            ) : (
                              <>
                                <strong>Image File:</strong> Click "View in Browser" to see the full-size image in a new tab.
                              </>
                            )
                          ) : (
                            t('language') === 'hi' ? (
                              <>
                                <strong>दस्तावेज़:</strong> नए टैब में फाइल खोलने के लिए "ब्राउज़र में देखें" पर क्लिक करें, 
                                या इसे अपने डिवाइस में सेव करने के लिए "डाउनलोड" का उपयोग करें।
                              </>
                            ) : (
                              <>
                                <strong>Document:</strong> Click "View in Browser" to open the file in a new tab, 
                                or use "Download" to save it to your device.
                              </>
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('language') === 'hi' ? 'कोई फाइल संलग्न नहीं' : 'No file attached'}
                    </h3>
                    <p className="text-gray-600">
                      {t('language') === 'hi' 
                        ? 'इस मेडिकल रिकॉर्ड में कोई संलग्न दस्तावेज़ नहीं है'
                        : "This medical record doesn't have an attached document"
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                {t('close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={t('language') === 'hi' ? 'रिकॉर्ड डिलीट करें' : 'Delete Record'}
        description={t('language') === 'hi' 
          ? 'क्या आप वाकई इस मेडिकल रिकॉर्ड को डिलीट करना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।'
          : 'Are you sure you want to delete this medical record? This action cannot be undone.'
        }
      />
    </>
  );
}
