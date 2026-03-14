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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600 mt-1">Your past diagnoses and health records</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading your records...</p>
            </div>
          ) : medicalHistory.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No medical history records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {medicalHistory.map((record, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900">{record.condition}</h3>
                      <p className="text-sm text-gray-500">
                        Diagnosed on: {new Date(record.diagnosedDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">
                      Record
                    </span>
                  </div>
                  {record.notes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 italic text-gray-700">
                      "{record.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold">Privacy Note</h4>
              <p className="text-blue-100 text-sm">Your medical records are encrypted and visible only to you and authorized medical staff.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalHistory;
