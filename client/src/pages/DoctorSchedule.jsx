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
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">View your appointments and weekly schedule</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Today's Appointments</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{todayAppts.length}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Total Appointments</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{appointments.length}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
            <p className="text-xs md:text-sm font-medium text-gray-600">Upcoming</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{upcomingAppts.length}</p>
          </div>
        </div>

        {/* Weekly Day Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Browse by Day</h2>
          <div className="flex overflow-x-auto pb-2 -mx-1 sm:mx-0 sm:flex-wrap sm:overflow-visible gap-2 mb-6 scrollbar-hide">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Appointments for selected day */}
          <div className="mt-6">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
              Schedule for {selectedDay}
            </h3>
            {dayAppts.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">No appointments scheduled for {selectedDay}.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayAppts.map(appt => (
                  <div key={appt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {appt.patientId?.userId?.name || 'Patient'}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-500 mt-1 flex items-center">
                        <span className="mr-2">📅</span> {new Date(appt.date).toLocaleDateString()}
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="mr-2">🕐</span> {appt.timeSlot ? `${appt.timeSlot.startTime} - ${appt.timeSlot.endTime}` : 'No time set'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                       <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                       <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold capitalize shadow-sm
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

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcomingAppts.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No upcoming appointments found.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.map(appt => (
                <div key={appt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition gap-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-xs md:text-sm">
                        {(appt.patientId?.userId?.name || 'P').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {appt.patientId?.userId?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {appt.timeSlot ? ` · ${appt.timeSlot.startTime} - ${appt.timeSlot.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-blue-100 text-blue-800 capitalize shadow-sm">
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

export default DoctorSchedule;
