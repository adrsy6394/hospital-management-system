import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      const allDoctors = res.data.data || [];
      // Match this doctor by userId
      const myDoctor = allDoctors.find(
        d => d.userId?._id === user?._id || d.userId === user?._id
      );
      setDoctor(myDoctor);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Your professional information and account details</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-white">
                {(user?.name || 'D').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Dr. {user?.name}</h2>
              <p className="text-blue-600 font-medium mt-1">
                {doctor?.specialization || 'Specialization not set'}
              </p>
              <p className="text-gray-500 text-sm mt-1">{doctor?.doctorId || ''}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                  Active
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</p>
                <p className="text-sm text-gray-900 mt-1 font-medium">Dr. {user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm text-gray-900 mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm text-gray-900 mt-1">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</p>
                <p className="text-sm text-gray-900 mt-1 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Professional Details</h3>
            {doctor ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Doctor ID</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">{doctor.doctorId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Specialization</p>
                  <p className="text-sm text-gray-900 mt-1">{doctor.specialization}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Qualification</p>
                  <p className="text-sm text-gray-900 mt-1">{doctor.qualification}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</p>
                  <p className="text-sm text-gray-900 mt-1">{doctor.experience} years</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Consultation Fee</p>
                  <p className="text-sm text-gray-900 mt-1">₹{(doctor.consultationFee || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {doctor.createdAt
                      ? new Date(doctor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Professional profile not found. Please contact the administrator to complete your profile setup.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;
