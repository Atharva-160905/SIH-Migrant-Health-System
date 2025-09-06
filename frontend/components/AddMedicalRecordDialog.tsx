import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface AddMedicalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  doctorId?: number;
  onSuccess: () => void;
}

export function AddMedicalRecordDialog({
  open,
  onOpenChange,
  patientId,
  doctorId,
  onSuccess,
}: AddMedicalRecordDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    record_type: 'other' as const,
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fileUrl = undefined;
      let fileName = undefined;
      let fileSize = undefined;

      // Upload file if provided
      if (formData.file) {
        const uploadResponse = await backend.storage.uploadFile({
          file_name: formData.file.name,
          content_type: formData.file.type,
        });

        // Upload the file to the signed URL
        await fetch(uploadResponse.upload_url, {
          method: 'PUT',
          body: formData.file,
          headers: {
            'Content-Type': formData.file.type,
          },
        });

        fileUrl = uploadResponse.file_url;
        fileName = formData.file.name;
        fileSize = formData.file.size;
      }

      // Create medical record
      await backend.health.addMedicalRecord({
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
        title: "Record added",
        description: "Medical record has been added successfully",
      });

      setFormData({
        title: '',
        description: '',
        record_type: 'other',
        file: null,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error adding record:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medical record",
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
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>
            Add a new medical record for the patient
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Enter record title"
            />
          </div>

          <div>
            <Label htmlFor="record_type">Record Type *</Label>
            <Select
              value={formData.record_type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, record_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_result">Lab Result</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter record description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="file">Attach File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
