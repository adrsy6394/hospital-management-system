const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const demoUsers = [
  { name: 'Admin User',       email: 'admin@hospital.com',   password: 'admin123',   role: 'admin',   phone: '9000000001' },
  { name: 'Dr. Demo Doctor',  email: 'doctor@hospital.com',  password: 'doctor123',  role: 'doctor',  phone: '9000000002' },
  { name: 'Staff Member',     email: 'staff@hospital.com',   password: 'staff123',   role: 'staff',   phone: '9000000003' },
  { name: 'Patient User',     email: 'patient@hospital.com', password: 'patient123', role: 'patient', phone: '9000000004' },
];

const seedUsers = async () => {
  await connectDB();

  const User = require('./models/User');
  const Patient = require('./models/Patient');
  const Doctor = require('./models/Doctor');

  // Clear existing data to avoid duplicates/collisions
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
  console.log('Cleared existing User, Patient, and Doctor data');

  for (const userData of demoUsers) {
    const user = await User.create(userData);
    console.log(`Created User: ${user.email} (role: ${user.role})`);

    if (user.role === 'patient') {
      await Patient.create({
        userId: user._id,
        age: 30,
        gender: 'male',
        address: '123 Demo St, Mumbai',
        bloodGroup: 'O+',
        emergencyContact: {
          name: 'Emergency Contact',
          relation: 'Friend',
          phone: '9999999999'
        },
        medicalHistory: [
          {
            condition: 'Seasonal Allergy',
            diagnosedDate: new Date('2023-01-10'),
            notes: 'Allergic to pollen'
          }
        ]
      });
      console.log(`Created Patient Profile for: ${user.email}`);
    }

    if (user.role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: 'General Physician',
        qualification: 'MBBS, MD',
        experience: 10,
        consultationFee: 500,
        availability: [
          {
            day: 'Monday',
            slots: [{ startTime: '09:00', endTime: '13:00' }]
          },
          {
            day: 'Wednesday',
            slots: [{ startTime: '14:00', endTime: '18:00' }]
          }
        ]
      });
      console.log(`Created Doctor Profile for: ${user.email}`);
    }
  }

  console.log('\nAll demo data seeded successfully!');
  process.exit(0);
};

seedUsers().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
