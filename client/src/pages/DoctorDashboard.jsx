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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-600">Today's Appointments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : stats.todayAppointments}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-sm text-gray-600">Total Patients Seen</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : stats.totalPatients}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
            <p className="text-sm text-gray-600">Upcoming Appointments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : stats.upcomingAppointments}
            </p>
          </div>
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
                        {new Date(appt.date).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric'
                        })}
                        {appt.timeSlot ? ` · ${appt.timeSlot.startTime} - ${appt.timeSlot.endTime}` : ''}
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

export default DoctorDashboard;
