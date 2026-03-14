import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const EditBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    paymentStatus: '',
    paymentMethod: '',
    paidAmount: 0,
    services: [],
    consultationFee: 0,
  });
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bills/${id}`);
      const data = response.data.data;
      setBill(data);
      setFormData({
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        paidAmount: data.paidAmount,
        services: data.services || [],
        consultationFee: data.consultationFee,
      });
    } catch (error) {
      console.error('Error fetching bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaidAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    let status = formData.paymentStatus;
    
    if (value >= bill.totalAmount) {
      status = 'paid';
    } else if (value > 0) {
      status = 'partial';
    } else {
      status = 'pending';
    }

    setFormData({
      ...formData,
      paidAmount: value,
      paymentStatus: status,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/bills/${id}`, formData);
      alert('Bill updated successfully!');
      navigate(`/admin/billing/${id}`);
    } catch (error) {
      console.error('Error updating bill:', error);
      alert('Failed to update bill');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bill
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Bill</h1>
          <p className="text-gray-600 mt-1">Update payment status for {bill?.billId}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Amount Due</p>
              <p className="text-2xl font-bold text-gray-900">₹{bill?.totalAmount.toLocaleString()}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Patient: <span className="font-bold">{bill?.patientId?.userId?.name}</span></p>
              <p>Current Status: <span className="font-bold capitalize">{bill?.paymentStatus}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid Amount (₹)
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handlePaidAmountChange}
                max={bill?.totalAmount}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>

            <div className="pt-4 flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditBill;
