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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Welcome, {user?.name}. Manage patients, appointments, and billing.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{loading ? '...' : stats.totalPatients}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Appointments Today</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{loading ? '...' : stats.todayAppointments}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-yellow-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Pending Bills</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{loading ? '...' : stats.pendingBills}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <button
            onClick={() => navigate('/admin/patients/add')}
            className="group bg-blue-600 text-white p-5 md:p-6 rounded-xl hover:bg-blue-700 transition text-left shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <p className="font-bold text-base md:text-lg">Register Patient</p>
            <p className="text-blue-100 text-xs mt-1">Add new patient files</p>
          </button>

          <button
            onClick={() => navigate('/staff/appointments')}
            className="group bg-green-600 text-white p-5 md:p-6 rounded-xl hover:bg-green-700 transition text-left shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-bold text-base md:text-lg">View Appointments</p>
            <p className="text-green-100 text-xs mt-1">Check today's schedule</p>
          </button>

          <button
            onClick={() => navigate('/admin/billing/generate')}
            className="group bg-purple-600 text-white p-5 md:p-6 rounded-xl hover:bg-purple-700 transition text-left shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <p className="font-bold text-base md:text-lg">Generate Bill</p>
            <p className="text-purple-100 text-xs mt-1">Create new invoices</p>
          </button>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Appointments</h2>
            <button className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-800 transition">View All</button>
          </div>
          {loading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">No appointments found yet.</div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map(appt => (
                <div key={appt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-xs md:text-sm">
                        {(appt.patientId?.userId?.name || 'P').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {appt.patientId?.userId?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 truncate">
                        Dr. {appt.doctorId?.userId?.name || 'Unknown'} ·{' '}
                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold capitalize shadow-sm
                      ${appt.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${appt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                      ${appt.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {appt.status}
                    </span>
                  </div>
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
