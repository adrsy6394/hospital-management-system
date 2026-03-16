import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      await api.delete(`/doctors/${doctorToDelete}`);
      setDoctors(doctors.filter(d => d._id !== doctorToDelete));
      setDoctorToDelete(null);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert(`Failed to delete doctor: ${error.response?.data?.message || error.message}`);
      setDoctorToDelete(null);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.doctorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">View and manage doctor records</p>
          </div>
          <button 
            onClick={() => navigate('/admin/doctors/add')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base"
          >
            + Add New Doctor
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
              placeholder="Search by doctor name, ID, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700 text-sm md:text-base"
            />
          </div>
        </div>

         {/* Stats */}
        {!loading && doctors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600">Total Doctors</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{doctors.length}</p>
            </div>
            {/* Add more stats if needed */}
          </div>
        )}

        {/* Doctor List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm md:text-base text-gray-600 mt-4">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm md:text-base text-gray-600 font-medium">No doctors found</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Start by adding a new doctor</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] md:min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor ID</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fee</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{doctor.doctorId}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-xs md:text-sm">
                              {doctor.userId?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{doctor.userId?.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{doctor.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.specialization}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.experience} Yrs</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{doctor.consultationFee}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {doctor.userId?.phone}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => navigate(`/admin/doctors/${doctor._id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/doctors/edit/${doctor._id}`)}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => setDoctorToDelete(doctor._id)}
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
        {doctorToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this doctor? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setDoctorToDelete(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Delete Doctor
                </button>
              </div>
            </div>
          </div>
        )}
       
      </div>
    </Layout>
  );
};

export default DoctorList;
