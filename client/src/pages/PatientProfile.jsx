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
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div className="px-1 sm:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Your personal information and medical details</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white">
              <span className="text-3xl md:text-5xl font-bold text-white uppercase">
                {(user?.name || 'P').charAt(0)}
              </span>
            </div>
            <div className="text-center md:text-left flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{user?.name}</h2>
                  <p className="text-blue-600 font-bold text-sm md:text-base mt-1 flex items-center justify-center md:justify-start">
                    <span className="mr-2">🆔</span> {patient?.patientId || 'ID Pending'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    Active
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow-md transition duration-300">
            <h3 className="text-base md:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center">
              <span className="mr-2">👤</span> Personal Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Gender</p>
                  <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold capitalize">{patient?.gender || 'N/A'}</p>
                </div>
                <div className="group">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Age</p>
                  <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold">{patient?.age ? `${patient.age} Yrs` : 'N/A'}</p>
                </div>
              </div>
              <div className="group border-t border-gray-50 pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Email Address</p>
                <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold truncate">{user?.email}</p>
              </div>
              <div className="group border-t border-gray-50 pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Phone Number</p>
                <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Medical Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow-md transition duration-300">
            <h3 className="text-base md:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center">
              <span className="mr-2">🏥</span> Medical Profile
            </h3>
            {patient ? (
              <div className="space-y-4">
                <div className="group">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition">Blood Group</p>
                  <p className="text-sm md:text-lg text-red-600 mt-1 font-black">{patient.bloodGroup || 'Not set'}</p>
                </div>
                <div className="group border-t border-gray-50 pt-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Residential Address</p>
                  <p className="text-sm text-gray-900 mt-1 font-medium leading-relaxed">{patient.address}</p>
                </div>
                <div className="group border-t border-gray-50 pt-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Emergency Contact</p>
                  <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group-hover:bg-white transition">
                    <p className="text-sm font-bold text-gray-900">{patient.emergencyContact?.name || 'N/A'}</p>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                      <span className="text-blue-600">{patient.emergencyContact?.relation}</span> · {patient.emergencyContact?.phone}
                    </p>
                  </div>
                </div>
                <div className="group border-t border-gray-50 pt-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Member Since</p>
                  <p className="text-sm text-gray-600 mt-1 font-bold">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-xs px-4 italic">Profile details are incomplete. Please visit the help desk.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;
