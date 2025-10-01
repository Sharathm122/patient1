const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const connectDB = require('./config/database');

// Sample data from your existing dummyAuth.js
const users = [
  // Patient users
  {
    email: 'patient@demo.com',
    password: 'demo123',
    role: 'patient',
    name: 'John Smith',
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date('1985-03-15'),
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      memberId: 'MEM123456789',
      groupNumber: 'GRP001',
      insuranceProvider: 'HealthPlus Insurance',
      planType: 'Premium Care Plan',
      effectiveDate: new Date('2024-01-01'),
      copay: '$25',
      deductible: '$1,500',
      outOfPocketMax: '$5,000'
    }
  },
  {
    email: 'jane.doe@example.com',
    password: 'patient123',
    role: 'patient',
    name: 'Jane Doe',
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-07-22'),
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Springfield, ST 67890',
      memberId: 'MEM987654321',
      groupNumber: 'GRP002',
      insuranceProvider: 'MediCare Plus',
      planType: 'Standard Plan',
      effectiveDate: new Date('2024-02-15'),
      copay: '$30',
      deductible: '$2,000',
      outOfPocketMax: '$6,500'
    }
  },

  // Provider users
  {
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
  {
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
  {
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
  {
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
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing users
    console.log('🗑️ Clearing existing users...');
    await User.deleteMany({});

    // Insert sample users
    console.log('🌱 Seeding database with sample users...');
    const createdUsers = await User.insertMany(users);

    console.log(`✅ Successfully created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;