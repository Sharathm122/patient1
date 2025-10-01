# 🗄️ MongoDB Setup Guide for HealthClaim Portal

## 📋 **Prerequisites**

### **Option 1: Local MongoDB Installation**

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install with default settings

2. **Start MongoDB Service:**
   ```bash
   # MongoDB should start automatically, or use:
   net start MongoDB
   ```

3. **Verify Installation:**
   ```bash
   # Open Command Prompt and test connection:
   mongosh
   # Should connect to MongoDB shell
   ```

### **Option 2: MongoDB Atlas (Cloud - Recommended)**

1. **Create Free Account:**
   - Visit: https://cloud.mongodb.com
   - Sign up for free (512MB storage)

2. **Create Cluster:**
   - Choose "Shared" (free tier)
   - Select cloud provider and region
   - Click "Create Cluster"

3. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

---

## 🚀 **Quick Start Commands**

### **1. Start MongoDB (if using local installation):**
```bash
# Make sure MongoDB service is running
net start MongoDB
```

### **2. Update Environment Variables:**
```bash
# Edit .env file with your MongoDB connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/healthclaim-portal

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthclaim-portal
```

### **3. Seed the Database:**
```bash
npm run seed
```

### **4. Start the Backend Server:**
```bash
npm run backend
```

### **5. Start Frontend (in another terminal):**
```bash
npm run dev
```

### **6. Or Start Both Together:**
```bash
npm run start:all
```

---

## 🧪 **Testing the Setup**

### **1. Health Check:**
Visit: http://localhost:5000/api/health
Should return:
```json
{
  "success": true,
  "message": "HealthClaim Portal Backend API is running",
  "timestamp": "2025-10-01T...",
  "environment": "development"
}
```

### **2. Test Login with MongoDB:**
- Frontend: http://localhost:3002
- Use any of the seeded credentials:
  - `patient@demo.com` / `demo123`
  - `provider@demo.com` / `provider123`
  - `payor@demo.com` / `payor123`

### **3. Verify Database:**
```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use healthclaim-portal

# Check users collection
db.users.find().pretty()
```

---

## 📁 **Project Structure**

```
patient/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/
│   │   └── User.js             # User schema
│   ├── routes/
│   │   └── auth.js             # API routes
│   ├── server.js               # Express server
│   └── seedDatabase.js         # Database seeder
├── src/
│   ├── services/
│   │   └── apiService.js       # Updated for MongoDB
│   └── data/
│       └── dummyAuth.js        # Keep for fallback
├── .env                        # Environment variables
└── package.json               # Updated with backend scripts
```

---

## 🔧 **Troubleshooting**

### **MongoDB Connection Issues:**
1. **Local MongoDB not starting:**
   ```bash
   # Check if MongoDB service is running
   sc query MongoDB
   
   # Start if stopped
   net start MongoDB
   ```

2. **Atlas connection issues:**
   - Check username/password in connection string
   - Ensure IP address is whitelisted (use 0.0.0.0/0 for development)
   - Verify database user has read/write permissions

### **Backend Issues:**
1. **Port conflicts:**
   - Backend runs on port 5000
   - Frontend runs on port 3002
   - Change PORT in .env if needed

2. **Dependencies missing:**
   ```bash
   npm install
   ```

### **CORS Issues:**
- Ensure FRONTEND_URL in .env matches your React app URL
- Default: http://localhost:3002

---

## 🎯 **API Endpoints Available**

### **Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### **Health Check:**
- `GET /api/health` - Backend health status

---

## 🔒 **Security Features**

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication  
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Environment variable protection

---

## 🎉 **You're All Set!**

Your HealthClaim Portal now has:
1. **MongoDB Database** with user authentication
2. **Express Backend** with REST API
3. **React Frontend** connected to real database
4. **JWT Authentication** for secure sessions
5. **Role-Based Access** for Patient/Provider/Payor users

**Next Steps:**
1. Run the setup commands above
2. Test login with seeded users
3. Your dummy data is now stored in MongoDB!
4. Frontend will seamlessly connect to the database

Need help? Check the console logs for detailed error messages! 🚀