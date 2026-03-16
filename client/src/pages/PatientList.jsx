import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/patients');
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await api.delete(`/patients/${patientToDelete}`);
      setPatients(patients.filter(p => p._id !== patientToDelete));
      setPatientToDelete(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert(`Failed to delete patient: ${error.response?.data?.message || error.message}`);
      setPatientToDelete(null);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">View and manage patient records</p>
          </div>
          <button 
            onClick={() => navigate('/admin/patients/add')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base"
          >
            + Add New Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 md:space-x-4">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700 text-sm md:text-base"
            />
          </div>
        </div>

         {/* Stats */}
        {!loading && patients.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{patients.length}</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600">Male Patients</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {patients.filter(p => p.gender === 'male').length}
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600">Female Patients</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {patients.filter(p => p.gender === 'female').length}
              </p>
            </div>
          </div>
        )}

        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm md:text-base text-gray-600 mt-4">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm md:text-base text-gray-600 font-medium">No patients found</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Start by adding a new patient</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] md:min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient ID</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age/Gender</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Blood</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{patient.patientId}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-xs md:text-sm">
                              {patient.userId?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{patient.userId?.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{patient.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient.age} / <span className="capitalize">{patient.gender}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] md:text-xs font-medium">
                          {patient.bloodGroup || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient.userId?.phone}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => navigate(`/admin/patients/${patient._id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/patients/edit/${patient._id}`)}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => setPatientToDelete(patient._id)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

       
        {/* Delete Confirmation Modal */}
        {patientToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this patient? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setPatientToDelete(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Delete Patient
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientList;
