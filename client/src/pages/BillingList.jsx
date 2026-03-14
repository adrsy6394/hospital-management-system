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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'patient' ? 'My Bills' : 'Billing Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'patient' ? 'View your medical bills and payment status' : 'View and manage all bills'}
            </p>
          </div>
          {user?.role !== 'patient' && (
            <button
              onClick={() => navigate(`${user?.role === 'admin' ? '/admin' : '/staff'}/billing/generate`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              + Generate New Bill
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2">
              {['all', 'paid', 'pending', 'partial'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading bills...</p>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No bills found</p>
              <p className="text-gray-500 text-sm mt-1">
                {filter === 'all' ? 'Start by generating a new bill' : `No ${filter} bills`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bill ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    {user?.role !== 'patient' && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{bill.billId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {bill.patientId?.userId?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{bill.patientId?.patientId}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">₹{bill.totalAmount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">₹{bill.paidAmount || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(bill.paymentStatus)}`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 capitalize">{bill.paymentMethod || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </td>
                      {user?.role !== 'patient' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => navigate(`${user.role === 'admin' ? '/admin' : '/staff'}/billing/${bill._id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium mr-3"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => navigate(`${user.role === 'admin' ? '/admin' : '/staff'}/billing/edit/${bill._id}`)}
                            className="text-green-600 hover:text-green-700 font-medium mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => navigate(`${user.role === 'admin' ? '/admin' : '/staff'}/billing/${bill._id}`)}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Print
                          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Bills</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{bills.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                ₹{bills.reduce((sum, bill) => sum + (bill.totalAmount - (bill.paidAmount || 0)), 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Paid Bills</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
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
