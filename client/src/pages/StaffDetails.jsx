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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-3xl font-bold">
                  {staff.userId?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{staff.userId?.name}</h1>
                <p className="text-gray-600">Staff ID: {staff.staffId}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {staff.department}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {staff.position}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/admin/staff/edit/${staff._id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold w-full md:w-auto text-center"
            >
              Edit Staff Member
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Professional Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="text-base text-gray-900 mt-1">{staff.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Position / Title</p>
                    <p className="text-base text-gray-900 mt-1">{staff.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned Shift</p>
                    <p className="text-base text-gray-900 mt-1 capitalize flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 
                        ${staff.shift === 'morning' ? 'bg-yellow-400' : ''}
                        ${staff.shift === 'evening' ? 'bg-orange-400' : ''}
                        ${staff.shift === 'night' ? 'bg-indigo-400' : ''}
                      `}></span>
                      {staff.shift}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Salary</p>
                    <p className="text-base text-gray-900 mt-1">
                      {staff.salary ? `₹${staff.salary.toLocaleString()}` : 'Not Specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joining Date</p>
                    <p className="text-base text-gray-900 mt-1">
                      {new Date(staff.joiningDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-base text-gray-900 mt-1">{staff.userId?.phone || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-base text-gray-900 mt-1 break-all">{staff.userId?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">System Role</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1 uppercase">
                      {staff.userId?.role || 'Staff'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Active
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

export default StaffDetails;
