import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalStaff: 0,
    totalRevenue: 0,
    appointmentsToday: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [patientsRes, doctorsRes, staffRes, appointmentsRes, billsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/staff'),
        api.get('/appointments'),
        api.get('/bills'),
      ]);

      const bills = billsRes.data.data || [];
      const totalRevenue = bills.reduce((acc, bill) => {
        return bill.paymentStatus === 'paid' ? acc + (bill.totalAmount || 0) : acc;
      }, 0);

      const allAppointments = appointmentsRes.data.data || [];
      const today = new Date().toDateString();
      const appointmentsToday = allAppointments.filter(
        (a) => new Date(a.date).toDateString() === today
      ).length;

      setStats({
        totalPatients: patientsRes.data.count || 0,
        totalDoctors: doctorsRes.data.count || 0,
        totalStaff: staffRes.data.count || 0,
        totalRevenue,
        appointmentsToday,
      });

      // Recent 3 appointments
      const sorted = [...allAppointments].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentAppointments(sorted.slice(0, 3));

      // Recent 3 bills
      const sortedBills = [...bills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentBills(sortedBills.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage hospital operations and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.totalPatients}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.totalDoctors}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.appointmentsToday}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue (Paid)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Appointments</h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : recentAppointments.length === 0 ? (
                <p className="text-sm text-gray-500">No appointments yet.</p>
              ) : recentAppointments.map((app) => (
                <div key={app._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {app.patientId?.userId?.name || 'Patient'} — Dr. {app.doctorId?.userId?.name || 'Doctor'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(app.date).toLocaleDateString()} &nbsp;·&nbsp;
                      <span className={`capitalize font-medium ${app.status === 'completed' ? 'text-green-600' : app.status === 'cancelled' ? 'text-red-500' : 'text-blue-600'}`}>
                        {app.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Billing</h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : recentBills.length === 0 ? (
                <p className="text-sm text-gray-500">No billing records yet.</p>
              ) : recentBills.map((bill) => (
                <div key={bill._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {bill.billId} — ₹{(bill.totalAmount || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className={`capitalize font-medium ${bill.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {bill.paymentStatus}
                      </span>
                      &nbsp;·&nbsp;{new Date(bill.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
