import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorSchedule = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

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

      // Find this doctor's record
      const allDoctors = doctorsRes.data.data || [];
      const myDoctor = allDoctors.find(d => d.userId?._id === user?._id || d.userId === user?._id);
      setDoctor(myDoctor);

      // Filter appointments that belong to this doctor
      const allAppts = apptRes.data.data || [];
      const myAppts = allDoctors.length > 0 && myDoctor
        ? allAppts.filter(a => a.doctorId?._id === myDoctor._id || a.doctorId === myDoctor._id)
        : [];
      setAppointments(myAppts);
    } catch (err) {
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter today's appointments
  const todayAppts = appointments.filter(a => {
    return new Date(a.date).toDateString() === new Date().toDateString();
  });

  // Filter for selected week day
  const dayAppts = appointments.filter(a => {
    const dayName = new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' });
    return dayName === selectedDay;
  });

  const upcomingAppts = appointments
    .filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">View your appointments and weekly schedule</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{todayAppts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-gray-500">Total Appointments</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
            <p className="text-sm font-medium text-gray-500">Upcoming</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingAppts.length}</p>
          </div>
        </div>

        {/* Weekly Day Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Browse by Day</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Appointments for selected day */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {selectedDay}
            </h3>
            {dayAppts.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No appointments scheduled for {selectedDay}.</p>
            ) : (
              <div className="space-y-3">
                {dayAppts.map(appt => (
                  <div key={appt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {appt.patientId?.userId?.name || 'Patient'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(appt.date).toLocaleDateString()} · {appt.timeSlot ? `${appt.timeSlot.startTime} - ${appt.timeSlot.endTime}` : 'No time set'}
                      </p>
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

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcomingAppts.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming appointments found.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.map(appt => (
                <div key={appt._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
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
                      <p className="text-xs text-gray-500">
                        {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        {appt.timeSlot ? ` · ${appt.timeSlot.startTime} - ${appt.timeSlot.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
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

export default DoctorSchedule;
