import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const MedicalHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/patients/me');
      setMedicalHistory(response.data.data?.medicalHistory || []);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Medical History</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Your past diagnoses and health records</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center bg-gray-50/30">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium mt-4">Retrieving your health records...</p>
            </div>
          ) : medicalHistory.length === 0 ? (
            <div className="p-12 text-center bg-gray-50/30">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold">No medical records found</p>
              <p className="text-gray-500 text-sm mt-1">Your records will appear here after consultation</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {medicalHistory.map((record, index) => (
                <div key={index} className="p-5 md:p-6 hover:bg-gray-50 transition group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">{record.condition}</h3>
                      <div className="flex items-center text-xs md:text-sm text-gray-500 font-medium">
                        <span className="mr-2">📅</span>
                        <span>Diagnosed on: {new Date(record.diagnosedDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      Health Record
                    </span>
                  </div>
                  {record.notes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-700 text-sm leading-relaxed relative">
                      <span className="absolute -top-2 left-4 px-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Physician Notes</span>
                      "{record.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 hidden sm:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg">Security & Privacy</h4>
              <p className="text-blue-50 text-xs md:text-sm leading-snug">Your medical information is encrypted and only accessible to you and your assigned medical team.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalHistory;
