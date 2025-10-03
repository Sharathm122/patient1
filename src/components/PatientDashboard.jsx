import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Bell, 
  FileText, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Upload,
  Eye,
  Download,
  AlertCircle,
  X,
  User,
  CreditCard,
  Phone,
  MapPin
} from 'lucide-react';

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAllClaims, setShowAllClaims] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Check if user is new (recently registered) vs existing user
  const [userData, setUserData] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      
      // Check if user is new (created within last 5 minutes or has MongoDB _id)
      const isRecentlyCreated = user._id && user.createdAt && 
        new Date(user.createdAt) > new Date(Date.now() - 5 * 60 * 1000);
      
      // New user if: has MongoDB _id (from registration) OR doesn't have predefined profile data
      const hasMinimalProfile = !user.profile?.memberId || user.profile?.memberId?.startsWith('MEM' + Date.now().toString().slice(-5));
      
      const newUser = isRecentlyCreated || hasMinimalProfile || !user.profile?.insuranceProvider || user.profile?.insuranceProvider === 'Default Insurance';
      setIsNewUser(newUser);

      // Initialize notifications based on user type
      const initialNotifications = newUser ? [
        {
          id: 1,
          type: 'welcome',
          title: 'Welcome to Your Healthcare Portal',
          message: 'Complete your profile setup to get started with managing your healthcare.',
          time: 'Just now',
          unread: true
        }
      ] : [
        {
          id: 1,
          type: 'approval',
          title: 'Claim Approved',
          message: 'Your emergency visit claim (CLM-2024-001) has been approved for $1,250',
          time: '2 hours ago',
          unread: true
        },
        {
          id: 2,
          type: 'action_required',
          title: 'Documents Needed',
          message: 'Additional documentation required for claim CLM-2024-002',
          time: '1 day ago',
          unread: true
        },
        {
          id: 3,
          type: 'denial',
          title: 'Claim Denied',
          message: 'Claim CLM-2024-003 was denied. You can appeal this decision.',
          time: '3 days ago',
          unread: false
        }
      ];
      
      setNotifications(initialNotifications);
    }
  }, []);

  // Mock data - conditional based on user type
  const insuranceInfo = isNewUser ? {
    policyNumber: 'Pending Setup',
    provider: userData?.profile?.insuranceProvider || 'Not Set',
    coverageStatus: 'Setup Required',
    expiryDate: 'Not Available',
    deductible: 'Not Set',
    deductibleMet: '$0',
    outOfPocketMax: 'Not Set',
    outOfPocketMet: '$0'
  } : {
    policyNumber: 'BC-789-456-123',
    provider: 'BlueCross BlueShield',
    coverageStatus: 'Active',
    expiryDate: 'December 31, 2024',
    deductible: '$1,500',
    deductibleMet: '$850',
    outOfPocketMax: '$5,000',
    outOfPocketMet: '$1,200'
  };

  const claims = isNewUser ? [] : [
    {
      id: 'CLM-2024-001',
      provider: 'City General Hospital',
      service: 'Emergency Visit',
      date: '2024-01-15',
      amount: '$1,250',
      status: 'approved',
      progress: 100,
      description: 'Acute chest pain evaluation'
    },
    {
      id: 'CLM-2024-002',
      provider: 'Downtown Clinic',
      service: 'Annual Physical',
      date: '2024-01-10',
      amount: '$350',
      status: 'processing',
      progress: 65,
      description: 'Routine annual physical examination'
    },
    {
      id: 'CLM-2024-003',
      provider: 'Specialty Care Center',
      service: 'Cardiology Consultation',
      date: '2024-01-05',
      amount: '$800',
      status: 'denied',
      progress: 100,
      description: 'Cardiac stress test and consultation'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'denied':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'action_required':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'denial':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  // Handler functions
  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setShowClaimModal(true);
  };

  const handleDownload = (claim) => {
    // Simulate document download
    const filename = `${claim.id}_${claim.service.replace(/\s+/g, '_')}_Receipt.pdf`;
    
    // Create a fake download
    const element = document.createElement('a');
    const file = new Blob([`Claim Receipt - ${claim.id}\n\nService: ${claim.service}\nProvider: ${claim.provider}\nDate: ${claim.date}\nAmount: ${claim.amount}\nStatus: ${claim.status}\n\nDescription: ${claim.description}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Show success message
    alert(`Document "${filename}" has been downloaded successfully!`);
  };

  // Notification handlers
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, unread: false }))
    );
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(true);
  };

  const handleUploadDocuments = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    
    fileInput.onchange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        alert(`Successfully selected ${files.length} file(s): ${fileNames}\n\nIn a real application, these would be uploaded to the server and associated with your account.`);
      }
    };
    
    // Trigger the file picker
    fileInput.click();
  };

  const handleViewAllClaims = () => {
    setShowAllClaims(true);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Welcome back, John</h1>
          <p className="text-gray-600">Here's an overview of your health insurance claims and coverage</p>
        </div>
        <Button 
          onClick={handleUploadDocuments}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg rounded-xl"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Insurance Coverage Card */}
      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Insurance Coverage</CardTitle>
                <CardDescription className="text-gray-600">
                  Policy: {insuranceInfo.policyNumber}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1">
              {insuranceInfo.coverageStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Insurance Provider</p>
              <p className="text-lg text-gray-900">{insuranceInfo.provider}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Coverage Expires</p>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-lg text-gray-900">{insuranceInfo.expiryDate}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Deductible Progress</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{insuranceInfo.deductibleMet}</span>
                  <span className="text-gray-600">{insuranceInfo.deductible}</span>
                </div>
                <Progress value={56} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Out-of-Pocket Progress</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{insuranceInfo.outOfPocketMet}</span>
                  <span className="text-gray-600">{insuranceInfo.outOfPocketMax}</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims and Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claims Section */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl">Recent Claims</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleViewAllClaims}
                  className="rounded-xl"
                >
                  View All Claims
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claims.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Yet</h3>
                    <p className="text-gray-500">
                      {isNewUser 
                        ? "Welcome! Once you submit your first claim, it will appear here." 
                        : "You don't have any claims to display at the moment."
                      }
                    </p>
                  </div>
                ) : (
                  claims.map((claim) => (
                  <div key={claim.id} className="p-6 border border-gray-200 rounded-2xl bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(claim.status)}
                        <div>
                          <p className="text-gray-900 font-medium">{claim.service}</p>
                          <p className="text-sm text-gray-500">{claim.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-gray-900">{claim.amount}</p>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Claim ID: {claim.id}</span>
                        <span>Date: {claim.date}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700">{claim.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Processing Progress</span>
                          <span>{claim.progress}%</span>
                        </div>
                        <Progress value={claim.progress} className="h-2" />
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(claim)}
                          className="rounded-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(claim)}
                          className="rounded-lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div>
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      notification.unread 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={handleViewAllNotifications}
                className="w-full mt-4 rounded-xl"
              >
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Claim Details Modal */}
      {showClaimModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowClaimModal(false)}
                  className="rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Claim ID</p>
                      <p className="font-semibold">{selectedClaim.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(selectedClaim.status)}>
                        {selectedClaim.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Service Date</p>
                      <p className="font-semibold">{selectedClaim.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-lg">{selectedClaim.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Service Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Healthcare Provider</p>
                          <p className="font-medium">{selectedClaim.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Service Type</p>
                          <p className="font-medium">{selectedClaim.service}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="text-gray-900">{selectedClaim.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Processing Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{selectedClaim.progress}% Complete</span>
                      </div>
                      <Progress value={selectedClaim.progress} className="h-3" />
                      <div className="text-sm text-gray-600">
                        {selectedClaim.status === 'approved' && 'Your claim has been approved and payment is being processed.'}
                        {selectedClaim.status === 'processing' && 'Your claim is currently under review by our team.'}
                        {selectedClaim.status === 'denied' && 'This claim was denied. You may file an appeal if you disagree with this decision.'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={() => handleDownload(selectedClaim)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowClaimModal(false)}
                    className="rounded-lg"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Notifications</h2>
                <div className="flex items-center space-x-2">
                  {notifications.some(n => n.unread) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="rounded-lg"
                    >
                      Mark All as Read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {notification.unread && (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{notification.time}</p>
                          {notification.unread && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-lg"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  variant="outline"
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Claims Modal */}
      {showAllClaims && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Claims History</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAllClaims(false)}
                  className="rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-4 flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Search claims..." 
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              <div className="space-y-4">
                {/* Extended claims list - conditional based on user type */}
                {isNewUser ? (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Claims History</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      You haven't submitted any claims yet. When you do, they'll appear here with detailed tracking information.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAllClaims(false);
                        setActiveModal('submitClaim');
                      }}
                      className="rounded-xl"
                    >
                      Submit Your First Claim
                    </Button>
                  </div>
                ) : (
                  [...claims, 
                    {
                      id: 'CLM-2024-004',
                      provider: 'Regional Eye Care',
                      service: 'Eye Examination',
                      date: '2023-12-20',
                      amount: '$275',
                      status: 'approved',
                      progress: 100,
                      description: 'Annual comprehensive eye exam and vision screening'
                    },
                    {
                      id: 'CLM-2024-005',
                      provider: 'Metro Dental Associates',
                      service: 'Dental Cleaning',
                      date: '2023-12-10',
                      amount: '$180',
                      status: 'approved',
                      progress: 100,
                      description: 'Routine dental cleaning and examination'
                    },
                    {
                      id: 'CLM-2024-006',
                      provider: 'Physical Therapy Center',
                      service: 'Physical Therapy',
                      date: '2023-11-25',
                      amount: '$450',
                      status: 'processing',
                      progress: 40,
                      description: 'Lower back physical therapy sessions (6 visits)'
                    }
                  ].map((claim) => (
                  <div key={claim.id} className="p-6 border border-gray-200 rounded-2xl bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(claim.status)}
                        <div>
                          <p className="text-gray-900 font-medium">{claim.service}</p>
                          <p className="text-sm text-gray-500">{claim.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-gray-900">{claim.amount}</p>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Claim ID: {claim.id}</span>
                        <span>Date: {claim.date}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700">{claim.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Processing Progress</span>
                          <span>{claim.progress}%</span>
                        </div>
                        <Progress value={claim.progress} className="h-2" />
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(claim)}
                          className="rounded-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(claim)}
                          className="rounded-lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>

              {!isNewUser && (
                <div className="flex justify-between items-center pt-6">
                  <p className="text-sm text-gray-600">Showing 6 of 15 total claims</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="rounded-lg">Previous</Button>
                    <Button variant="outline" size="sm" className="rounded-lg">Next</Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowAllClaims(false)}
                  className="rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;