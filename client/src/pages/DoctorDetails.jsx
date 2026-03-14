import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/doctors/${id}`);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
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
            <p className="text-gray-600 mt-4">Loading doctor details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Doctor not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {doctor.userId?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{doctor.userId?.name}</h1>
                <p className="text-gray-600">Doctor ID: {doctor.doctorId}</p>
                <p className="text-sm text-gray-500">{doctor.userId?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/admin/doctors/edit/${doctor._id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Edit Doctor
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 font-medium text-sm transition border-blue-600 text-blue-600">
                Overview
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Profile</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="text-base font-medium text-gray-900">{doctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="text-base font-medium text-gray-900">{doctor.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="text-base font-medium text-gray-900">{doctor.experience} Years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="text-base font-medium text-gray-900">₹{doctor.consultationFee}</p>
                  </div>
                </div>
              </div>

              {/* Personal Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-base font-medium text-gray-900">{doctor.userId?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-base font-medium text-gray-900">{doctor.userId?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      Active
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetails;
