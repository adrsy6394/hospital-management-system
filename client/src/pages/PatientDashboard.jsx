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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-1">View your appointments and medical history</p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Next Appointment */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Appointment</h3>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointments[0].doctorId?.userId?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointments[0].doctorId?.specialization}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Scheduled
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    📅 {new Date(appointments[0].date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    🕐 {appointments[0].timeSlot?.startTime} - {appointments[0].timeSlot?.endTime}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/patient/appointments')}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  View All Appointments
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">No upcoming appointments</p>
                <button 
                  onClick={() => navigate('/patient/book')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          {/* Medical Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Summary</h3>
            {patientData ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Patient ID:</span>
                  <span className="text-blue-600 font-medium">{patientData.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Blood Group:</span>
                  <span className="text-red-600 font-medium">{patientData.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Age:</span>
                  <span className="text-gray-900">{patientData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Gender:</span>
                  <span className="text-gray-900 capitalize">{patientData.gender}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Complete your profile to see medical summary</p>
            )}
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          {patientData?.medicalHistory && patientData.medicalHistory.length > 0 ? (
            <div className="space-y-4">
              {patientData.medicalHistory.slice(0, 3).map((record, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{record.condition}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Diagnosed: {new Date(record.diagnosedDate).toLocaleDateString()}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-700 mt-2">{record.notes}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Condition
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">No medical history recorded</p>
              <p className="text-gray-500 text-sm mt-1">Your medical records will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/patient/book')}
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition text-left"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="font-semibold">Book Appointment</p>
            <p className="text-sm text-blue-100 mt-1">Schedule a consultation</p>
          </button>
          
          <button 
            onClick={() => navigate('/patient/history')}
            className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition text-left"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold">Medical History</p>
            <p className="text-sm text-green-100 mt-1">View your records</p>
          </button>
          
          <button 
            onClick={() => navigate('/patient/bills')}
            className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition text-left"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            <p className="font-semibold">My Bills</p>
            <p className="text-sm text-purple-100 mt-1">View billing history</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;

