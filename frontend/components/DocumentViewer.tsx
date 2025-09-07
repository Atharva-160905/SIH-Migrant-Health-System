import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, X, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
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
    created_at: Date;
    doctor_name?: string;
  } | null;
}

export function DocumentViewer({ open, onOpenChange, record }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDownload = async () => {
    if (!record?.file_url) {
      toast({
        title: "No file attached",
        description: "This record doesn't have an attached file",
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
        title: "Download failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInBrowser = async () => {
    if (!record?.file_url) {
      toast({
        title: "No file attached",
        description: "This record doesn't have an attached file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.storage.downloadFile({ file_path: record.file_url });
      setPreviewUrl(response.download_url);
      
      // Open in new tab for better viewing experience
      window.open(response.download_url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      console.error('View error:', error);
      toast({
        title: "View failed",
        description: error.message || "Failed to view file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
            <div className="flex items-center space-x-2 mb-3">
              {getRecordTypeBadge(record.record_type)}
              <span className="text-sm text-gray-600">
                {new Date(record.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {record.description && (
              <p className="text-sm text-gray-700 mb-3">{record.description}</p>
            )}
            
            {record.doctor_name && (
              <p className="text-xs text-gray-500">
                Added by: Dr. {record.doctor_name}
              </p>
            )}
          </div>

          {/* File Information */}
          {record.file_url && record.file_name ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Attached Document
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
                        Loading...
                      </div>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        {t('view')} in Browser
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
                      <>
                        <strong>PDF Document:</strong> Click "View in Browser" to open the PDF in a new tab for easy reading. 
                        You can zoom, search, and navigate through pages.
                      </>
                    ) : isImageFile(record.file_name) ? (
                      <>
                        <strong>Image File:</strong> Click "View in Browser" to see the full-size image in a new tab.
                      </>
                    ) : (
                      <>
                        <strong>Document:</strong> Click "View in Browser" to open the file in a new tab, 
                        or use "Download" to save it to your device.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No file attached</h3>
              <p className="text-gray-600">
                This medical record doesn't have an attached document
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
