import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MedicalHistory from './pages/MedicalHistory';
import PatientProfile from './pages/PatientProfile';

// Patient Management
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';

// Doctor Management
import DoctorList from './pages/DoctorList';
import AddDoctor from './pages/AddDoctor';
import DoctorDetails from './pages/DoctorDetails';
import EditDoctor from './pages/EditDoctor';

// Doctor Portal Pages
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorProfile from './pages/DoctorProfile';

// Staff Management
import StaffList from './pages/StaffList';
import AddStaff from './pages/AddStaff';
import StaffDetails from './pages/StaffDetails';
import EditStaff from './pages/EditStaff';

// Analytics & Reports
import Reports from './pages/Reports';

// Appointment Management
import AppointmentList from './pages/AppointmentList';

// Billing Management
import BillingList from './pages/BillingList';
import GenerateBill from './pages/GenerateBill';
import BillDetails from './pages/BillDetails';
import EditBill from './pages/EditBill';


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Dashboard Router - redirects based on role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'doctor':
      return <Navigate to="/doctor" replace />;
    case 'staff':
      return <Navigate to="/staff" replace />;
    case 'patient':
      return <Navigate to="/patient" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Root - Redirect to role-based dashboard */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DoctorList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors/add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddDoctor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DoctorDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditDoctor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/patients" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <PatientList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/patients/add" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AddPatient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/patients/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <EditPatient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/patients/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <PatientDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/staff" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StaffList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/staff/add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddStaff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/staff/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StaffDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/staff/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditStaff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/appointments" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AppointmentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/billing" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <BillingList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/billing/generate" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <GenerateBill />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/billing/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <BillDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/billing/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <EditBill />
              </ProtectedRoute>
            } 
          />
          
          {/* Doctor Routes */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AppointmentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/patients" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PatientList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/schedule" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorSchedule />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/profile" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Staff Routes */}
          <Route 
            path="/staff" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/patients" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <PatientList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/appointments" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <AppointmentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/billing" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <BillingList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/billing/generate" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <GenerateBill />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/billing/:id" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <BillDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/billing/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <EditBill />
              </ProtectedRoute>
            } 
          />
          
          {/* Patient Routes */}
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/appointments" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AppointmentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/history" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicalHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/book" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/bills" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BillingList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/profile" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
