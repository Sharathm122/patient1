// Dummy authentication data for testing
// This simulates a database of users with different roles

export const dummyUsers = {
  // Patient users
  'patient@demo.com': {
    id: 'patient_001',
    email: 'patient@demo.com',
    password: 'demo123',
    role: 'patient',
    name: 'John Smith',
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-03-15',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      memberId: 'MEM123456789',
      groupNumber: 'GRP001',
      insuranceProvider: 'HealthPlus Insurance',
      planType: 'Premium Care Plan',
      effectiveDate: '2024-01-01',
      copay: '$25',
      deductible: '$1,500',
      outOfPocketMax: '$5,000'
    }
  },
  'jane.doe@example.com': {
    id: 'patient_002', 
    email: 'jane.doe@example.com',
    password: 'patient123',
    role: 'patient',
    name: 'Jane Doe',
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1990-07-22',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Springfield, ST 67890',
      memberId: 'MEM987654321',
      groupNumber: 'GRP002',
      insuranceProvider: 'MediCare Plus',
      planType: 'Standard Plan',
      effectiveDate: '2024-02-15',
      copay: '$30',
      deductible: '$2,000',
      outOfPocketMax: '$6,500'
    }
  },

  // Provider users
  'provider@demo.com': {
    id: 'provider_001',
    email: 'provider@demo.com', 
    password: 'provider123',
    role: 'provider',
    name: 'Dr. Sarah Wilson',
    profile: {
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      specialty: 'Internal Medicine',
      licenseNumber: 'MD12345',
      npiNumber: '1234567890',
      clinic: 'Central Medical Center',
      address: '789 Medical Plaza, Healthcare City, ST 11111',
      phone: '(555) 246-8100',
      fax: '(555) 246-8101',
      yearsExperience: 15,
      boardCertified: true
    }
  },
  'dr.johnson@healthcenter.com': {
    id: 'provider_002',
    email: 'dr.johnson@healthcenter.com',
    password: 'health123', 
    role: 'provider',
    name: 'Dr. Michael Johnson',
    profile: {
      firstName: 'Dr. Michael',
      lastName: 'Johnson',
      specialty: 'Cardiology',
      licenseNumber: 'MD67890',
      npiNumber: '0987654321',
      clinic: 'Heart Health Institute',
      address: '321 Cardiac Way, Wellness Town, ST 22222',
      phone: '(555) 369-2580',
      fax: '(555) 369-2581',
      yearsExperience: 20,
      boardCertified: true
    }
  },

  // Payor users  
  'payor@demo.com': {
    id: 'payor_001',
    email: 'payor@demo.com',
    password: 'payor123', 
    role: 'payor',
    name: 'Lisa Thompson',
    profile: {
      firstName: 'Lisa',
      lastName: 'Thompson',
      title: 'Claims Administrator',
      department: 'Claims Processing',
      company: 'HealthPlus Insurance',
      employeeId: 'EMP789012',
      phone: '(555) 147-2583',
      extension: '1205',
      address: '999 Insurance Blvd, Coverage City, ST 33333',
      region: 'Northeast',
      authority: 'Senior Claims Reviewer'
    }
  },
  'admin@insurance.com': {
    id: 'payor_002',
    email: 'admin@insurance.com',
    password: 'insurance123',
    role: 'payor', 
    name: 'Robert Chen',
    profile: {
      firstName: 'Robert',
      lastName: 'Chen',
      title: 'Senior Underwriter',
      department: 'Risk Assessment',
      company: 'MediCare Plus',
      employeeId: 'EMP456789',
      phone: '(555) 789-4561',
      extension: '2108',
      address: '777 Underwriter St, Policy Town, ST 44444',
      region: 'Southwest',
      authority: 'Policy Authorization'
    }
  }
};

// Demo credentials summary for easy reference
export const demoCredentials = {
  patient: [
    { email: 'patient@demo.com', password: 'demo123', name: 'John Smith' },
    { email: 'jane.doe@example.com', password: 'patient123', name: 'Jane Doe' }
  ],
  provider: [
    { email: 'provider@demo.com', password: 'provider123', name: 'Dr. Sarah Wilson' },
    { email: 'dr.johnson@healthcenter.com', password: 'health123', name: 'Dr. Michael Johnson' }
  ],
  payor: [
    { email: 'payor@demo.com', password: 'payor123', name: 'Lisa Thompson' },
    { email: 'admin@insurance.com', password: 'insurance123', name: 'Robert Chen' }
  ]
};

// Authentication function
export const authenticateUser = (email, password, role) => {
  const user = dummyUsers[email];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  if (user.password !== password) {
    return { success: false, error: 'Invalid password' };
  }
  
  if (user.role !== role) {
    return { success: false, error: 'Invalid role for this user' };
  }
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  return { 
    success: true, 
    user: userWithoutPassword,
    token: `dummy_token_${user.id}_${Date.now()}` // Simulate JWT token
  };
};

// Get user by token (for session management)
export const getUserByToken = (token) => {
  // In a real app, this would validate JWT and return user data
  // For demo, we'll extract user ID from token
  const userId = token?.split('_')[2];
  const user = Object.values(dummyUsers).find(u => u.id === userId);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

// Role-based dashboard routes
export const getDashboardRoute = (role) => {
  const routes = {
    patient: '/dashboard',
    provider: '/provider-dashboard',
    payor: '/payor-dashboard'
  };
  
  return routes[role] || '/dashboard';
};