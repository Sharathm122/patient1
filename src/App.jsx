import { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import PatientDashboard from './components/PatientDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import PayorDashboard from './components/PayorDashboard';
import { getUserByToken } from './data/dummyAuth';
import './index.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (has auth token)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (err) {
        // If there's an error parsing user data, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (role, userInfo) => {
    setCurrentUser(userInfo);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // Render different dashboards based on user role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'provider':
        return <ProviderDashboard />;
      case 'payor':
        return <PayorDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="pt-20">
        {renderDashboard()}
      </main>
    </div>
  );
}