import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';

interface AccessRequest {
  id: number;
  patient_id: number;
  doctor_id: number;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  requested_at: Date;
  responded_at?: Date;
  doctor_name: string;
  patient_name: string;
}

interface AccessRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: AccessRequest[];
  onRespond: (requestId: number, status: 'approved' | 'denied') => void;
}

export function AccessRequestDialog({
  open,
  onOpenChange,
  requests,
  onRespond,
}: AccessRequestDialogProps) {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      denied: "destructive",
    };
    return <Badge variant={variants[status]}>{t(status)}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('accessRequests')}</DialogTitle>
          <DialogDescription>
            {t('language') === 'hi' 
              ? 'डॉक्टरों से सभी पहुंच अनुरोधों की समीक्षा करें'
              : 'Review all access requests from doctors'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {t('language') === 'hi' ? 'डॉ.' : 'Dr.'} {request.doctor_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-gray-500">
                      {t('requested')}: {new Date(request.requested_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onRespond(request.id, 'approved')}
                    >
                      {t('approve')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRespond(request.id, 'denied')}
                    >
                      {t('deny')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t('language') === 'hi' 
                ? 'कोई पहुंच अनुरोध नहीं मिला।'
                : 'No access requests found.'
              }
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
