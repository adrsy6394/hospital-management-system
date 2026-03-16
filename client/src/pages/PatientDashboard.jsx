import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
    fetchAppointments();
  }, []);

  const fetchPatientData = async () => {
    try {
      // Fetch patient profile based on logged-in user
      const response = await api.get('/patients/me');
      setPatientData(response.data.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      const allAppointments = response.data.data || [];
      // Filter for upcoming appointments
      const upcoming = allAppointments
        .filter(apt => apt.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
      setAppointments(upcoming ? [upcoming] : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">View your appointments and medical history</p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Next Appointment */}
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Next Appointment</h3>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {appointments[0].doctorId?.userId?.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {appointments[0].doctorId?.specialization}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    Scheduled
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 space-y-1">
                  <p className="text-xs md:text-sm text-gray-600 flex items-center">
                    <span className="mr-2">📅</span> {new Date(appointments[0].date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 flex items-center">
                    <span className="mr-2">🕐</span> {appointments[0].timeSlot?.startTime} - {appointments[0].timeSlot?.endTime}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/patient/appointments')}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-sm"
                >
                  View All Appointments
                </button>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-gray-500 text-sm mb-4">No upcoming appointments</p>
                <button 
                  onClick={() => navigate('/patient/book')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-sm"
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          {/* Medical Summary */}
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Medical Summary</h3>
            {patientData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs md:text-sm font-medium text-gray-500">Patient ID</span>
                  <span className="text-sm font-bold text-blue-600">{patientData.patientId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs md:text-sm font-medium text-gray-500">Blood Group</span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{patientData.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs md:text-sm font-medium text-gray-500">Age / Gender</span>
                  <span className="text-sm font-bold text-gray-900">{patientData.age}y · <span className="capitalize">{patientData.gender}</span></span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-xs px-4">Complete your profile to see your medical summary</p>
              </div>
            )}
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Medical History</h3>
            <button 
              onClick={() => navigate('/patient/history')}
              className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-bold transition"
            >
              View All
            </button>
          </div>
          
          {patientData?.medicalHistory && patientData.medicalHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patientData.medicalHistory.slice(0, 3).map((record, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{record.condition}</h4>
                      <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                        Diagnosed: {new Date(record.diagnosedDate).toLocaleDateString()}
                      </p>
                      {record.notes && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2 italic">"{record.notes}"</p>
                      )}
                    </div>
                    <span className="flex-shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase">
                      Condition
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold">No history recorded</p>
              <p className="text-gray-500 text-xs mt-1">Records will appear after consultation</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/patient/book')}
            className="group bg-blue-600 text-white p-5 md:p-6 rounded-xl hover:bg-blue-700 transition text-left shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="font-bold text-base md:text-lg">Book Appointment</p>
            <p className="text-xs text-blue-100 mt-1">Schedule a consultation</p>
          </button>
          
          <button 
            onClick={() => navigate('/patient/history')}
            className="group bg-green-600 text-white p-5 md:p-6 rounded-xl hover:bg-green-700 transition text-left shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-bold text-base md:text-lg">Medical History</p>
            <p className="text-xs text-green-100 mt-1">View your records</p>
          </button>
          
          <button 
            onClick={() => navigate('/patient/bills')}
            className="group bg-purple-600 text-white p-5 md:p-6 rounded-xl hover:bg-purple-700 transition text-left shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <p className="font-bold text-base md:text-lg">My Bills</p>
            <p className="text-xs text-purple-100 mt-1">View billing history</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;

