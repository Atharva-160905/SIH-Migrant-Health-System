import { LogOut, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, profile, logout } = useAuth();

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || 'User';
  };

  const getRoleDisplay = () => {
    const roleMap = {
      patient: 'Patient',
      doctor: 'Doctor',
      admin: 'Administrator'
    };
    return roleMap[user?.role as keyof typeof roleMap] || '';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HealthRecord</h1>
              <p className="text-xs text-gray-500">Digital Health Record System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{getDisplayName()}</div>
                <div className="text-gray-500">{getRoleDisplay()}</div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
