import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BillingList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bills');
      setBills(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      partial: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true;
    return bill.paymentStatus === filter;
  });

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user?.role === 'patient' ? 'My Bills' : 'Billing Management'}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {user?.role === 'patient' ? 'View your medical bills and payment status' : 'View and manage all bills'}
            </p>
          </div>
          {user?.role !== 'patient' && (
            <button
              onClick={() => navigate(`${user?.role === 'admin' ? '/admin' : '/staff'}/billing/generate`)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base"
            >
              + Generate New Bill
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['all', 'paid', 'pending', 'partial'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition capitalize whitespace-nowrap ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm md:text-base text-gray-600 mt-4">Loading bills...</p>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <p className="text-sm md:text-base text-gray-600 font-medium">No bills found</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {filter === 'all' ? 'Start by generating a new bill' : `No ${filter} bills`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] md:min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bill ID</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid Amount</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    {user?.role !== 'patient' && (
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{bill.billId}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-[150px]">
                          {bill.patientId?.userId?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{bill.patientId?.patientId}</p>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">₹{bill.totalAmount}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">₹{bill.paidAmount || 0}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium capitalize ${getStatusColor(bill.paymentStatus)}`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {bill.paymentMethod || 'N/A'}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </td>
                      {user?.role !== 'patient' && (
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => navigate(`${user.role === 'admin' ? '/admin' : '/staff'}/billing/${bill._id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => navigate(`${user.role === 'admin' ? '/admin' : '/staff'}/billing/edit/${bill._id}`)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => navigate(`${user.role === 'admin' ? '/admin' : '/staff'}/billing/${bill._id}`)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Print
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && bills.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Total Bills</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{bills.length}</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl md:text-3xl font-bold text-green-600 mt-1 md:mt-2">
                ₹{bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0)}
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Pending Amount</p>
              <p className="text-xl md:text-3xl font-bold text-yellow-600 mt-1 md:mt-2">
                ₹{bills.reduce((sum, bill) => sum + (bill.totalAmount - (bill.paidAmount || 0)), 0)}
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center sm:text-left">
              <p className="text-xs md:text-sm text-gray-600">Paid Bills</p>
              <p className="text-xl md:text-3xl font-bold text-blue-600 mt-1 md:mt-2">
                {bills.filter(b => b.paymentStatus === 'paid').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BillingList;
