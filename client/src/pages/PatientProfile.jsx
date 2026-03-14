import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const PatientProfile = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients/me');
      setPatient(res.data.data);
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
          <p className="text-gray-600 mt-1">Your personal information and medical details</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-4xl font-bold text-white">
                {(user?.name || 'P').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500 font-medium mt-1">{patient?.patientId || 'Patient ID pending'}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                <p className="text-base text-gray-900 mt-1 font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-base text-gray-900 mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="text-base text-gray-900 mt-1">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</p>
                <p className="text-base text-gray-900 mt-1 capitalize">{patient?.gender || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Age</p>
                <p className="text-base text-gray-900 mt-1">{patient?.age} years</p>
              </div>
            </div>
          </div>

          {/* Medical Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Medical Details</h3>
            {patient ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Group</p>
                  <p className="text-base text-red-600 font-bold mt-1">{patient.bloodGroup || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Home Address</p>
                  <p className="text-base text-gray-900 mt-1">{patient.address}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Contact</p>
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{patient.emergencyContact?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-1">{patient.emergencyContact?.relation} • {patient.emergencyContact?.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration Date</p>
                  <p className="text-base text-gray-900 mt-1">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">Profile details are currently incomplete. Please contact hospital reception.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;
