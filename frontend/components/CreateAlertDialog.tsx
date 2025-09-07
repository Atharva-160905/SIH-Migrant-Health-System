import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  doctorId: number;
  onSuccess: () => void;
}

export function CreateAlertDialog({
  open,
  onOpenChange,
  patientId,
  doctorId,
  onSuccess,
}: CreateAlertDialogProps) {
  const [formData, setFormData] = useState({
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await backend.health.createAlert({
        doctor_id: doctorId,
        patient_id: patientId,
        severity: formData.severity,
        title: formData.title,
        description: formData.description,
      });

      toast({
        title: t('language') === 'hi' ? 'अलर्ट बनाया गया' : 'Alert created',
        description: t('alertCreated'),
      });

      setFormData({
        severity: 'medium',
        title: '',
        description: '',
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error creating alert:', error);
      toast({
        title: t('error'),
        description: error.message || (t('language') === 'hi' ? 'अलर्ट बनाने में असफल' : 'Failed to create alert'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('createAlert')}</DialogTitle>
          <DialogDescription>
            {t('language') === 'hi' 
              ? 'आपातकालीन या गंभीर मामलों के लिए प्रशासक को अलर्ट भेजें'
              : 'Raise an alert to admin for emergency or critical cases'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="severity">{t('alertSeverity')} *</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, severity: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('language') === 'hi' ? 'गंभीरता स्तर चुनें' : 'Select severity level'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('low')}</SelectItem>
                <SelectItem value="medium">{t('medium')}</SelectItem>
                <SelectItem value="high">{t('high')}</SelectItem>
                <SelectItem value="critical">{t('critical')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">{t('alertTitle')} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder={t('language') === 'hi' ? 'अलर्ट शीर्षक दर्ज करें' : 'Enter alert title'}
            />
          </div>

          <div>
            <Label htmlFor="description">{t('alertDescription')} *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              placeholder={t('language') === 'hi' ? 'स्थिति या आपातकाल का वर्णन करें' : 'Describe the situation or emergency'}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} variant="destructive">
              {isLoading ? t('creating') : t('createAlert')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
