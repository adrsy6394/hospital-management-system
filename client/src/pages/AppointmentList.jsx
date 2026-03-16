import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AppointmentList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments');
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleReschedule = (appointment) => {
    // For now, redirect to the booking page with a message
    // A full rescheduling system would involve a dedicated page or deeper modal integration
    alert('Rescheduling feature is being enhanced. Please contact the front desk or book a new slot if needed.');
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/${id}`, { status: 'cancelled' });
        fetchAppointments(); // Refresh list
        alert('Appointment cancelled successfully');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      rescheduled: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage and view all appointments</p>
          </div>
          {user?.role === 'patient' && (
            <button 
              onClick={() => navigate('/patient/book')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base"
            >
              + Book New Appointment
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['all', 'scheduled', 'completed', 'cancelled', 'rescheduled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition capitalize whitespace-nowrap ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm md:text-base text-gray-600 mt-4">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm md:text-base text-gray-600 font-medium">No appointments found</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {filter === 'all' ? 'Start by booking a new appointment' : `No ${filter} appointments`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="p-4 md:p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {appointment.appointmentId}
                        </h3>
                        <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600">Patient</p>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            {appointment.patientId?.userId?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Doctor</p>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            {appointment.doctorId?.userId?.name || 'N/A'}
                          </p>
                          <p className="text-[11px] md:text-xs text-gray-500">
                            {appointment.doctorId?.specialization}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Date & Time</p>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Symptoms</p>
                          <p className="text-sm md:text-base text-gray-900">{appointment.symptoms || 'N/A'}</p>
                        </div>
                      </div>

                      {appointment.diagnosis && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs md:text-sm font-medium text-blue-900">Diagnosis</p>
                          <p className="text-xs md:text-sm text-blue-800 mt-1">{appointment.diagnosis}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-4 flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                      <button 
                        onClick={() => handleViewDetails(appointment)}
                        className="flex-1 lg:flex-none px-4 py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                      {appointment.status === 'scheduled' && (
                        <>
                          <button 
                            onClick={() => handleReschedule(appointment)}
                            className="flex-1 lg:flex-none px-4 py-2 text-xs md:text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancel(appointment._id)}
                            className="flex-1 lg:flex-none px-4 py-2 text-xs md:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && appointments.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Total</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{appointments.length}</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Scheduled</p>
              <p className="text-xl md:text-3xl font-bold text-blue-600 mt-1 md:mt-2">
                {appointments.filter(a => a.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Completed</p>
              <p className="text-xl md:text-3xl font-bold text-green-600 mt-1 md:mt-2">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Cancelled</p>
              <p className="text-xl md:text-3xl font-bold text-red-600 mt-1 md:mt-2">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Appointment Details
                </h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{selectedAppointment.appointmentId}</p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <section>
                  <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold capitalize ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </section>
                <section>
                  <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Name</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {selectedAppointment.patientId?.userId?.name || 'N/A'}
                  </p>
                </section>
                <section>
                  <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor Name</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {selectedAppointment.doctorId?.userId?.name || 'N/A'}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">{selectedAppointment.doctorId?.specialization}</p>
                </section>
              </div>

              <div className="space-y-4">
                <section>
                  <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment Date</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {new Date(selectedAppointment.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </section>
                <section>
                  <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Time</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {selectedAppointment.timeSlot?.startTime} - {selectedAppointment.timeSlot?.endTime}
                  </p>
                </section>
                <section>
                  <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Symptoms</label>
                  <p className="text-sm md:text-base text-gray-700 italic border-l-4 border-blue-200 pl-4 py-1">
                    "{selectedAppointment.symptoms || 'None reported'}"
                  </p>
                </section>
              </div>
            </div>

            {selectedAppointment.diagnosis && (
              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-[10px] md:text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Final Diagnosis</h4>
                <p className="text-sm md:text-base text-blue-800 leading-relaxed">{selectedAppointment.diagnosis}</p>
              </div>
            )}

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-gray-900 text-white rounded-lg md:rounded-xl hover:bg-black transition font-semibold text-sm md:text-base"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AppointmentList;
