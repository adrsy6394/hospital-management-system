import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/staff/${id}`);
      setStaff(response.data.data);
    } catch (error) {
      console.error('Error fetching staff details:', error);
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
            <p className="text-gray-600 mt-4">Loading staff details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!staff) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Staff member not found</p>
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
                  {(staff.userId?.name || 'S').charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{staff.userId?.name}</h1>
                <p className="text-blue-600 font-bold text-sm md:text-base mt-1 flex items-center justify-center sm:justify-start">
                  <span className="mr-2 italic">🆔</span> {staff.staffId}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-widest">
                    {staff.department}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-widest">
                    {staff.position}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/admin/staff/edit/${staff._id}`)}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Staff Member
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50">
            <nav className="flex space-x-6 px-4 md:px-6">
              <button className="py-4 px-1 border-b-2 font-bold text-xs md:text-sm uppercase tracking-widest transition border-blue-600 text-blue-600">
                Staff Information
              </button>
            </nav>
          </div>

          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Professional Section */}
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Professional Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                  <div className="group">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Department Unit</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{staff.department}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4 sm:border-0 sm:pt-0 md:border-t md:pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Assigned Position</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{staff.position}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Duty Shift</p>
                    <div className="flex items-center mt-2 bg-gray-50 inline-flex px-3 py-1.5 rounded-lg border border-gray-100">
                      <span className={`w-2.5 h-2.5 rounded-full mr-2.5 shadow-sm
                        ${staff.shift === 'morning' ? 'bg-yellow-400' : ''}
                        ${staff.shift === 'evening' ? 'bg-orange-400' : ''}
                        ${staff.shift === 'night' ? 'bg-indigo-400' : ''}
                      `}></span>
                      <p className="text-sm font-bold text-gray-700 capitalize">{staff.shift} Shift</p>
                    </div>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-emerald-500 transition">Monthly Remuneration</p>
                    <p className="text-sm md:text-lg font-black text-emerald-600 mt-1">
                      {staff.salary ? `₹${staff.salary.toLocaleString()}` : 'Negotiable'}
                    </p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Date of Joining</p>
                    <p className="text-sm md:text-base font-bold text-gray-900 mt-1">
                      {new Date(staff.joiningDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900 border-l-4 border-gray-300 pl-3">Contact Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="group">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Registered Mobile</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">{staff.userId?.phone || 'Not available'}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Work Email Address</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-1 break-all truncate">{staff.userId?.email}</p>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition">Security Role</p>
                    <div className="mt-2">
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 mt-1 uppercase tracking-widest">
                        🛡️ {staff.userId?.role || 'Staff'}
                      </span>
                    </div>
                  </div>
                  <div className="group border-t border-gray-50 pt-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-green-500 transition">Employment Status</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase tracking-widest border border-green-100 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> Active Duty
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

export default StaffDetails;
