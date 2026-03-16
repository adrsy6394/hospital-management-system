import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/patients/${id}`);
      setPatient(response.data.data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading patient details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Patient not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white">
                <span className="text-white text-3xl md:text-4xl font-bold uppercase">
                  {(patient.userId?.name || 'P').charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{patient.userId?.name}</h1>
                <p className="text-blue-600 font-bold text-sm md:text-base mt-1 flex items-center justify-center sm:justify-start">
                  <span className="mr-2 italic">🆔</span> {patient.patientId}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">{patient.userId?.email}</p>
              </div>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Patient
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-6 px-4 md:px-6 min-w-max">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-bold text-[10px] md:text-xs uppercase tracking-widest transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Personal Overview
              </button>
              <button
                onClick={() => setActiveTab('medical-history')}
                className={`py-4 px-1 border-b-2 font-bold text-[10px] md:text-xs uppercase tracking-widest transition whitespace-nowrap ${
                  activeTab === 'medical-history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Clinical History
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-1 border-b-2 font-bold text-[10px] md:text-xs uppercase tracking-widest transition whitespace-nowrap ${
                  activeTab === 'appointments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Appointments
              </button>
            </nav>
          </div>

          <div className="p-5 md:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">Age</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{patient.age} Yrs</p>
                    </div>
                    <div className="group">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition capitalize">Gender</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 mt-1 capitalize">{patient.gender}</p>
                    </div>
                    <div className="group">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition">Blood Group</p>
                      <p className="text-sm md:text-base font-black text-red-600 mt-1">{patient.bloodGroup || 'N/A'}</p>
                    </div>
                    <div className="group">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Phone</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{patient.userId?.phone}</p>
                    </div>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition text-left">Primary Address</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1 leading-relaxed">{patient.address}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 border-l-4 border-gray-300 pl-3">Emergency Contact</h3>
                  {patient.emergencyContact ? (
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 group hover:bg-blue-50/30 transition duration-300">
                      <div className="space-y-5">
                        <div className="group">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Contact Name</p>
                          <p className="text-sm md:text-base font-bold text-gray-900 mt-1">{patient.emergencyContact.name}</p>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-white pt-4">
                          <div className="group">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Relationship</p>
                            <p className="text-xs md:text-sm font-semibold text-blue-700 mt-1">{patient.emergencyContact.relation}</p>
                          </div>
                          <div className="group">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Phone Number</p>
                            <p className="text-xs md:text-sm font-bold text-gray-900 mt-1">{patient.emergencyContact.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-xs italic">No emergency contact information provided</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'medical-history' && (
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Medical History</h3>
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {patient.medicalHistory.map((record, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 group hover:shadow-md hover:bg-white transition duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition">{record.condition}</h4>
                            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                               <span className="mr-2">📅</span>
                               Diagnosed: {new Date(record.diagnosedDate).toLocaleDateString()}
                            </div>
                            {record.notes && (
                              <div className="mt-4 p-4 bg-white/50 rounded-xl border border-white italic text-xs md:text-sm text-gray-600 leading-relaxed">
                                 "{record.notes}"
                              </div>
                            )}
                          </div>
                          <span className="self-start sm:self-auto px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            Health Record
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-bold">No Records Found</p>
                    <p className="text-gray-500 text-sm mt-1">Medical history will appear here after evaluation</p>
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Appointment History</h3>
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-bold">No Past Appointments</p>
                  <p className="text-gray-500 text-sm mt-1">Patient hasn't scheduled any consultations yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;
