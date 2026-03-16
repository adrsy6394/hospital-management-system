import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    upcomingAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [doctorsRes, apptRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/appointments'),
      ]);

      // Find this doctor's profile
      const allDoctors = doctorsRes.data.data || [];
      const myDoctor = allDoctors.find(
        d => d.userId?._id === user?._id || d.userId === user?._id
      );

      // Filter appointments for this doctor
      const allAppts = apptRes.data.data || [];
      const myAppts = myDoctor
        ? allAppts.filter(a => a.doctorId?._id === myDoctor._id || a.doctorId === myDoctor._id)
        : [];

      const today = new Date().toDateString();
      const todayAppointments = myAppts.filter(
        a => new Date(a.date).toDateString() === today
      ).length;

      const upcomingAppointments = myAppts.filter(
        a => new Date(a.date) >= new Date() && a.status !== 'cancelled'
      ).length;

      // Unique patients served
      const uniquePatientIds = new Set(myAppts.map(a => a.patientId?._id || a.patientId));
      const totalPatients = uniquePatientIds.size;

      setStats({ todayAppointments, totalPatients, upcomingAppointments });

      // Recent 5 appointments
      const sorted = [...myAppts].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentAppointments(sorted.slice(0, 5));
    } catch (err) {
      console.error('Error fetching doctor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back, Dr. {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Today's Appointments</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
              {loading ? '...' : stats.todayAppointments}
            </p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Total Patients Seen</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
              {loading ? '...' : stats.totalPatients}
            </p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Upcoming Appointments</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
              {loading ? '...' : stats.upcomingAppointments}
            </p>
          </div>
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
                      <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
                        {new Date(appt.date).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric'
                        })}
                        {appt.timeSlot ? ` · ${appt.timeSlot.startTime} - ${appt.timeSlot.endTime}` : ''}
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

export default DoctorDashboard;
