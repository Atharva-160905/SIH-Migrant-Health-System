import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Users, Activity, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDetailsDialog } from '../components/AlertDetailsDialog';
import backend from '~backend/client';

export function AdminDashboard() {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);

  const { data: alerts, refetch: refetchAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => backend.health.listAlerts(),
  });

  const handleUpdateAlertStatus = async (alertId: number, status: 'open' | 'in_progress' | 'resolved', notes?: string) => {
    try {
      await backend.health.updateAlertStatus({
        alert_id: alertId,
        status,
        admin_notes: notes,
      });
      toast({
        title: "Alert updated",
        description: `Alert status changed to ${status}`,
      });
      refetchAlerts();
      setShowAlertDetails(false);
    } catch (error: any) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update alert",
        variant: "destructive",
      });
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "destructive",
      in_progress: "default",
      resolved: "secondary",
    };
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const criticalAlerts = alerts?.alerts.filter(alert => alert.severity === 'critical' && alert.status === 'open') || [];
  const openAlerts = alerts?.alerts.filter(alert => alert.status === 'open') || [];
  const inProgressAlerts = alerts?.alerts.filter(alert => alert.status === 'in_progress') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Monitor system activity and manage alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-gray-600">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Alerts</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openAlerts.length}</div>
            <p className="text-xs text-gray-600">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressAlerts.length}</div>
            <p className="text-xs text-gray-600">Being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts?.alerts.length || 0}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="system">System Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alert Management
              </CardTitle>
              <CardDescription>
                Review and respond to alerts raised by doctors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts?.alerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getSeverityBadge(alert.severity)}
                          {getStatusBadge(alert.status)}
                        </div>
                        <h3 className="font-medium">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          <div>Patient: {alert.patient_name}</div>
                          <div>Doctor: {alert.doctor_name}</div>
                          <div>Created: {new Date(alert.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setShowAlertDetails(true);
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
                {alerts?.alerts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No alerts found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring</CardTitle>
              <CardDescription>
                Overview of system health and activity logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                System monitoring features coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedAlert && (
        <AlertDetailsDialog
          open={showAlertDetails}
          onOpenChange={setShowAlertDetails}
          alert={selectedAlert}
          onUpdateStatus={handleUpdateAlertStatus}
        />
      )}
    </div>
  );
}
