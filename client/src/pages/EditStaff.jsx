import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    shift: 'morning',
    salary: '',
  });

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get(`/staff/${id}`);
      const staff = data.data;
      
      setFormData({
        name: staff.userId?.name || '',
        email: staff.userId?.email || '',
        phone: staff.userId?.phone || '',
        department: staff.department || '',
        position: staff.position || '',
        shift: staff.shift || 'morning',
        salary: staff.salary || '',
      });
    } catch (err) {
      console.error('Error fetching staff member:', err);
      setError('Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // The API updates Staff-specific fields. User fields (name, email, phone) aren't updated here.
      await api.put(`/staff/${id}`, {
        department: formData.department,
        position: formData.position,
        shift: formData.shift,
        salary: formData.salary ? parseInt(formData.salary) : undefined,
      });

      alert('Staff member updated successfully!');
      navigate('/admin/staff');
    } catch (err) {
      console.error('Error updating staff member:', err);
      setError(err.response?.data?.message || 'Failed to update staff member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Staff Member</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Update staff professional duties and information</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-lg flex items-center text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">Personal Information (Read-Only)</h2>
            <p className="text-xs md:text-sm text-gray-500 mb-2">Core contact details can only be changed by the user.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  disabled
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Department <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Nursing"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Position <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Head Nurse"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Assigned Shift <span className="text-red-500">*</span></label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition text-sm md:text-base"
                >
                  <option value="morning">Morning Shift</option>
                  <option value="evening">Evening Shift</option>
                  <option value="night">Night Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Salary (₹)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  placeholder="Monthly salary"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/staff')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base mt-4 sm:mt-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm md:text-base"
            >
              {submitting ? 'Updating...' : 'Update Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditStaff;
