import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';

interface AddMedicalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  doctorId?: number;
  onSuccess: () => void;
  userRole?: 'patient' | 'doctor';
}

export function AddMedicalRecordDialog({
  open,
  onOpenChange,
  patientId,
  doctorId,
  onSuccess,
  userRole = 'patient',
}: AddMedicalRecordDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    record_type: 'other' as const,
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return t('language') === 'hi' 
        ? 'केवल PDF, JPG, JPEG, और PNG फाइलों की अनुमति है'
        : 'Only PDF, JPG, JPEG, and PNG files are allowed';
    }

    if (file.size > maxSize) {
      return t('language') === 'hi'
        ? 'फाइल का आकार 10MB से कम होना चाहिए'
        : 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        setFormData(prev => ({ ...prev, file: null }));
        e.target.value = '';
      } else {
        setFileError('');
        setFormData(prev => ({ ...prev, file }));
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFileError('');
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const uploadFileWithProgress = async (file: File, uploadUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const generateAISummary = async (recordId: number, filePath: string) => {
    setIsGeneratingSummary(true);
    try {
      // Generate summary for the appropriate user type
      const summaryResponse = await backend.ai.summarizeDocument({
        file_path: filePath,
        user_type: userRole,
        document_type: formData.record_type,
      });

      // Update the record with the generated summary
      const updateData = userRole === 'patient' 
        ? { patient_summary: summaryResponse.summary }
        : { doctor_summary: summaryResponse.summary };

      await backend.health.updateRecordSummary({
        record_id: recordId,
        ...updateData,
      });

      toast({
        title: t('language') === 'hi' ? 'AI सारांश तैयार' : 'AI Summary Generated',
        description: t('language') === 'hi' 
          ? 'आपके दस्तावेज़ का AI सारांश सफलतापूर्वक तैयार किया गया है'
          : 'AI summary for your document has been generated successfully',
      });
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast({
        title: t('language') === 'hi' ? 'AI सारांश त्रुटि' : 'AI Summary Error',
        description: t('language') === 'hi' 
          ? 'AI सारांश तैयार करने में असफल, लेकिन दस्तावेज़ सफलतापूर्वक अपलोड किया गया'
          : 'Failed to generate AI summary, but document was uploaded successfully',
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: t('validationError'),
        description: t('language') === 'hi' 
          ? 'कृपया मेडिकल रिकॉर्ड के लिए एक शीर्षक दर्ज करें'
          : 'Please enter a title for the medical record',
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      let fileUrl = undefined;
      let fileName = undefined;
      let fileSize = undefined;

      // Upload file if provided
      if (formData.file) {
        try {
          console.log('Starting file upload for:', formData.file.name);
          
          const uploadResponse = await backend.storage.uploadFile({
            file_name: formData.file.name,
            content_type: formData.file.type,
          });

          console.log('Upload response:', uploadResponse);

          // Upload the file to the signed URL with progress tracking
          await uploadFileWithProgress(formData.file, uploadResponse.upload_url);

          fileUrl = uploadResponse.file_path;
          fileName = formData.file.name;
          fileSize = formData.file.size;

          setUploadProgress(100);
          console.log('File upload completed successfully');
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          throw new Error(`${t('uploadFailed')}: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      // Create medical record
      console.log('Creating medical record with data:', {
        patient_id: patientId,
        doctor_id: doctorId,
        title: formData.title,
        description: formData.description || undefined,
        record_type: formData.record_type,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
      });

      const recordResponse = await backend.health.addMedicalRecord({
        patient_id: patientId,
        doctor_id: doctorId,
        title: formData.title,
        description: formData.description || undefined,
        record_type: formData.record_type,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
      });

      toast({
        title: t('success'),
        description: t('recordAdded'),
      });

      // Generate AI summary if file was uploaded
      if (fileUrl) {
        await generateAISummary(recordResponse.record_id, fileUrl);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        record_type: 'other',
        file: null,
      });
      setUploadProgress(0);
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding record:', error);
      toast({
        title: t('error'),
        description: error.message || (t('language') === 'hi' ? 'मेडिकल रिकॉर्ड जोड़ने में असफल' : 'Failed to add medical record'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {t('addMedicalRecord')}
          </DialogTitle>
          <DialogDescription>
            {t('language') === 'hi' 
              ? 'मरीज़ के लिए एक नया मेडिकल रिकॉर्ड जोड़ें। आप PDF, छवियां, या रिपोर्ट जैसी फाइलें संलग्न कर सकते हैं। AI स्वचालित रूप से आपके दस्तावेज़ का सारांश तैयार करेगा।'
              : 'Add a new medical record for the patient. You can attach files like PDFs, images, or reports. AI will automatically generate a summary of your document.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              {t('recordTitle')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder={t('language') === 'hi' 
                ? 'रिकॉर्ड शीर्षक दर्ज करें (जैसे, रक्त परीक्षण परिणाम)'
                : 'Enter record title (e.g., Blood Test Results)'
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="record_type" className="text-sm font-medium">
              {t('recordType')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.record_type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, record_type: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('selectRecordType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">{t('prescription')}</SelectItem>
                <SelectItem value="lab_result">{t('labResult')}</SelectItem>
                <SelectItem value="diagnosis">{t('diagnosis')}</SelectItem>
                <SelectItem value="treatment">{t('treatment')}</SelectItem>
                <SelectItem value="vaccination">{t('vaccination')}</SelectItem>
                <SelectItem value="other">{t('other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">{t('recordDescription')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('language') === 'hi' 
                ? 'रिकॉर्ड विवरण या नोट्स दर्ज करें'
                : 'Enter record description or notes'
              }
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="file" className="text-sm font-medium">
              {t('attachFile')}
              {formData.file && (
                <span className="ml-2 text-xs text-blue-600 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {t('language') === 'hi' ? 'AI सारांश तैयार होगा' : 'AI summary will be generated'}
                </span>
              )}
            </Label>
            
            {!formData.file ? (
              <div className="mt-1">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">{t('clickToUpload')}</span> {t('dragAndDrop')}
                    </p>
                    <p className="text-xs text-gray-500">{t('fileTypeRestriction')}</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('language') === 'hi' ? 'AI सारांश स्वचालित रूप से तैयार होगा' : 'AI summary will be generated automatically'}
                    </p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-1 p-3 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">{formData.file.name}</p>
                      <p className="text-xs text-blue-700">{formatFileSize(formData.file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}
          </div>

          {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <Label className="text-sm font-medium">{t('uploadProgress')}</Label>
              <Progress value={uploadProgress} className="mt-1" />
              <p className="text-xs text-gray-600 mt-1">
                {Math.round(uploadProgress)}% {t('language') === 'hi' ? 'अपलोड हो गया' : 'uploaded'}
              </p>
            </div>
          )}

          {isGeneratingSummary && (
            <div>
              <Label className="text-sm font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-blue-600" />
                {t('language') === 'hi' ? 'AI सारांश तैयार किया जा रहा है...' : 'Generating AI summary...'}
              </Label>
              <div className="mt-1 flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600">
                  {t('language') === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !!fileError}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                formData.file ? t('uploading') : t('adding')
              ) : (
                t('addRecord')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
