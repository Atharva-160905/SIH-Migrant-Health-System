import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AlertDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: any;
  onUpdateStatus: (alertId: number, status: 'open' | 'in_progress' | 'resolved', notes?: string) => void;
}

export function AlertDetailsDialog({
  open,
  onOpenChange,
  alert,
  onUpdateStatus,
}: AlertDetailsDialogProps) {
  const [status, setStatus] = useState(alert?.status || 'open');
  const [notes, setNotes] = useState(alert?.admin_notes || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onUpdateStatus(alert.id, status, notes);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low: "outline",
      medium: "default",
      high: "secondary",
      critical: "destructive",
    };
    return <Badge variant={variants[severity]}>{severity}</Badge>;
  };

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Alert Details</DialogTitle>
          <DialogDescription>
            Review and update alert status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Severity</Label>
              <div className="mt-1">
                {getSeverityBadge(alert.severity)}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <div className="text-sm text-gray-600 mt-1">
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Title</Label>
            <div className="text-sm mt-1">{alert.title}</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Description</Label>
            <div className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
              {alert.description}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Patient</Label>
              <div className="text-sm text-gray-600 mt-1">{alert.patient_name}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Doctor</Label>
              <div className="text-sm text-gray-600 mt-1">{alert.doctor_name}</div>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about actions taken or follow-up required"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
