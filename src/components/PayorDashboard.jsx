import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Shield, 
  FileCheck, 
  DollarSign, 
  TrendingDown, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building2
} from 'lucide-react';

const PayorDashboard = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      
      // Check if this is a new user
      const isNew = user._id && user._id.includes('new') ||
                    !user.profile?.companyName ||
                    user.profile?.companyName === 'Insurance Corp' ||
                    new Date() - new Date(user.createdAt || 0) < 24 * 60 * 60 * 1000; // Less than 24 hours
      
      setIsNewUser(isNew);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Insurance Portal</h1>
                <p className="text-gray-600">Welcome, Lisa Thompson</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => alert('Profile Settings - Manage your payor administrator profile, permissions, and system preferences.')}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Claims</p>
                  <p className="text-3xl font-bold text-gray-900">{isNewUser ? '0' : '156'}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Claims Processed</p>
                  <p className="text-3xl font-bold text-gray-900">{isNewUser ? '0' : '1,247'}</p>
                </div>
                <FileCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payouts</p>
                  <p className="text-3xl font-bold text-gray-900">{isNewUser ? '$0' : '$2.4M'}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fraud Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">{isNewUser ? '0' : '12'}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Claims */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Claims for Review</CardTitle>
                <CardDescription>
                  Claims requiring attention and processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'CLM-2024-001', patient: 'John Smith', provider: 'Central Medical', amount: '$2,450.00', status: 'Under Review', priority: 'High' },
                    { id: 'CLM-2024-002', patient: 'Jane Doe', provider: 'Heart Institute', amount: '$890.50', status: 'Pending Docs', priority: 'Medium' },
                    { id: 'CLM-2024-003', patient: 'Mike Johnson', provider: 'City Hospital', amount: '$1,200.00', status: 'Ready to Pay', priority: 'Low' },
                    { id: 'CLM-2024-004', patient: 'Sarah Wilson', provider: 'Wellness Center', amount: '$350.75', status: 'Investigating', priority: 'High' },
                  ].map((claim, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{claim.id}</p>
                          <p className="text-sm text-gray-600">{claim.patient} • {claim.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{claim.amount}</p>
                        <div className="flex items-center space-x-2">
                          {claim.status === 'Under Review' && <Clock className="w-4 h-4 text-yellow-500" />}
                          {claim.status === 'Ready to Pay' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {claim.status === 'Investigating' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {claim.status === 'Pending Docs' && <XCircle className="w-4 h-4 text-gray-400" />}
                          <span className="text-xs text-gray-600">{claim.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => alert('Process Claims Queue - Open the claims processing interface to review, approve, or deny pending insurance claims.')}
                  className="w-full justify-start bg-purple-500 hover:bg-purple-600"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Process Claims Queue
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => alert('Review Fraud Alerts - Access the fraud detection system to investigate suspicious claims and patterns.')}
                  className="w-full justify-start"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Review Fraud Alerts
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => alert('Provider Network - Manage healthcare provider partnerships, contracts, and network directory.')}
                  className="w-full justify-start"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Provider Network
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="text-sm font-medium text-green-600">92.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '92.5%'}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Processing Time</span>
                    <span className="text-sm font-medium text-blue-600">2.3 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '76%'}}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost Savings</span>
                    <span className="text-sm font-medium text-purple-600">$125K</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Potential Fraud</p>
                      <p className="text-xs text-gray-600">Claim CLM-2024-001 flagged</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">SLA Breach Risk</p>
                      <p className="text-xs text-gray-600">15 claims due today</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Budget Alert</p>
                      <p className="text-xs text-gray-600">Monthly budget 85% used</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayorDashboard;