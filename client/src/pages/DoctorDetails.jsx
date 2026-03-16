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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white">
                <span className="text-white text-3xl md:text-4xl font-bold uppercase">
                  {(doctor.userId?.name || 'D').charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{doctor.userId?.name}</h1>
                <p className="text-blue-600 font-bold text-sm md:text-base mt-1 flex items-center justify-center sm:justify-start">
                  <span className="mr-2 italic">⚕️</span> {doctor.specialization}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">{doctor.userId?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/admin/doctors/edit/${doctor._id}`)}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Doctor
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50">
            <nav className="flex space-x-6 px-4 md:px-6">
              <button className="py-4 px-1 border-b-2 font-bold text-xs md:text-sm uppercase tracking-widest transition border-blue-600 text-blue-600">
                Professional Overview
              </button>
            </nav>
          </div>

          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Professional Section */}
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center border-l-4 border-blue-600 pl-3">
                  Professional Profile
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <div className="group">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Specialization</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{doctor.specialization}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Primary Qualification</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{doctor.qualification}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Experience</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{doctor.experience} Successful Years</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Consultation Fee</p>
                    <p className="text-sm md:text-lg font-black text-blue-700 mt-1">₹{doctor.consultationFee.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Personal Section */}
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center border-l-4 border-gray-300 pl-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <div className="group">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Mobile Number</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{doctor.userId?.phone || 'Not available'}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Official Email</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1 truncate">{doctor.userId?.email}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Account Verification</p>
                    <div className="mt-2">
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider shadow-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> Verified Active
                      </span>
                    </div>
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
