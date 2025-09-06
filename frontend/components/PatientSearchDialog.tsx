import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface PatientSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: number;
  onPatientSelect: (patientId: number) => void;
  onAddRecord: (patientId: number) => void;
  onCreateAlert: (patientId: number) => void;
}

export function PatientSearchDialog({
  open,
  onOpenChange,
  doctorId,
  onPatientSelect,
  onAddRecord,
  onCreateAlert,
}: PatientSearchDialogProps) {
  const [medicalId, setMedicalId] = useState('');
  const [patient, setPatient] = useState<any>(null);
  const [accessStatus, setAccessStatus] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!medicalId.trim()) return;

    setIsSearching(true);
    try {
      const searchResult = await backend.health.searchPatient({ medical_id: medicalId.trim() });
      setPatient(searchResult.patient);

      // Check access status
      const accessResult = await backend.health.getPatientDetails({
        patient_id: searchResult.patient.id,
        doctor_id: doctorId,
      });
      setAccessStatus(accessResult);
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Patient not found",
        description: "No patient found with this Medical ID",
        variant: "destructive",
      });
      setPatient(null);
      setAccessStatus(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!patient) return;

    setIsRequesting(true);
    try {
      await backend.health.requestAccess({
        patient_id: patient.id,
        doctor_id: doctorId,
        reason: "Request access to view and update medical records",
      });

      toast({
        title: "Access requested",
        description: "Access request sent to patient for approval",
      });
    } catch (error: any) {
      console.error('Request access error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to request access",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const resetDialog = () => {
    setMedicalId('');
    setPatient(null);
    setAccessStatus(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search Patient</DialogTitle>
          <DialogDescription>
            Search for a patient using their Medical ID
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="medicalId">Medical ID</Label>
            <div className="flex space-x-2">
              <Input
                id="medicalId"
                value={medicalId}
                onChange={(e) => setMedicalId(e.target.value)}
                placeholder="Enter Medical ID"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {patient && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-lg">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">Medical ID: {patient.medical_id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {patient.date_of_birth && (
                      <div>
                        <span className="font-medium">DOB:</span> {new Date(patient.date_of_birth).toLocaleDateString()}
                      </div>
                    )}
                    {patient.gender && (
                      <div>
                        <span className="font-medium">Gender:</span> {patient.gender}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {accessStatus?.has_access ? (
                      <Badge variant="default">Access Granted</Badge>
                    ) : (
                      <Badge variant="outline">No Access</Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {accessStatus?.has_access ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            onPatientSelect(patient.id);
                            onAddRecord(patient.id);
                          }}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Add Record
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            onPatientSelect(patient.id);
                            onCreateAlert(patient.id);
                          }}
                          className="flex-1"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Create Alert
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleRequestAccess}
                        disabled={isRequesting}
                        className="w-full"
                      >
                        {isRequesting ? 'Requesting...' : 'Request Access'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
