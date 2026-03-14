import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingBills: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsRes, apptRes, billsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/bills'),
      ]);

      const allAppts = apptRes.data.data || [];
      const today = new Date().toDateString();
      const todayAppointments = allAppts.filter(
        a => new Date(a.date).toDateString() === today
      ).length;

      const bills = billsRes.data.data || [];
      const pendingBills = bills.filter(b => b.paymentStatus === 'pending').length;

      setStats({
        totalPatients: patientsRes.data.count || 0,
        todayAppointments,
        pendingBills,
      });

      // Recent 5 appointments
      const sorted = [...allAppts].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentAppointments(sorted.slice(0, 5));
    } catch (err) {
      console.error('Error fetching staff dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.name}. Manage patients, appointments, and billing.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.totalPatients}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-600">Appointments Today</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.todayAppointments}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-yellow-500">
            <p className="text-sm text-gray-600">Pending Bills</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.pendingBills}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/patients/add')}
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition text-left"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <p className="font-semibold">Register Patient</p>
          </button>

          <button
            onClick={() => navigate('/staff/appointments')}
            className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition text-left"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold">View Appointments</p>
          </button>

          <button
            onClick={() => navigate('/admin/billing/generate')}
            className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition text-left"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            <p className="font-semibold">Generate Bill</p>
          </button>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Appointments</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments found yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map(appt => (
                <div key={appt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">
                        {(appt.patientId?.userId?.name || 'P').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {appt.patientId?.userId?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Dr. {appt.doctorId?.userId?.name || 'Unknown'} ·{' '}
                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                    ${appt.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${appt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                    ${appt.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
