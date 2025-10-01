import { Shield, User, Bell, Heart, CheckCircle, XCircle, Clock, Upload, Eye, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/services/apiService';

export default function Header({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout(); // Logout on client side even if server call fails
    }
  };

  const getIcon = () => {
    switch (user?.role || user?.type) {
      case 'patient':
        return <User className="h-5 w-5 text-blue-600" />;
      default:
        return <User className="h-5 w-5 text-blue-600" />;
    }
  };

  const getUserColor = () => {
    switch (user?.role || user?.type) {
      case 'patient':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-gray-900">HealthClaim Portal</h1>
              <p className="text-sm text-gray-500">Patient Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 rounded-xl">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex items-center space-x-4 px-3 py-2 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getUserColor()}`}>
                {getIcon()}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{user?.name || 'Patient'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hover:bg-gray-100 rounded-xl border-gray-300"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}