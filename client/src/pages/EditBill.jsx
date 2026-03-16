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
      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
        <div className="px-1 sm:px-0">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors font-bold text-xs md:text-sm"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Bill Details
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Update Invoice</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Modifying payment status for <span className="text-blue-600 font-bold">{bill?.billId}</span></p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 md:p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount Due</p>
              <p className="text-2xl md:text-3xl font-black text-gray-900 mt-1">₹{bill?.totalAmount.toLocaleString()}</p>
            </div>
            <div className="text-center sm:text-right space-y-1">
              <p className="text-xs md:text-sm font-bold text-gray-700">Patient: <span className="text-blue-600">{bill?.patientId?.userId?.name}</span></p>
              <div className="flex items-center justify-center sm:justify-end gap-2 text-[10px] md:text-xs">
                 <span className="text-gray-400 font-bold uppercase tracking-widest">Live Status:</span>
                 <span className={`px-2 py-0.5 rounded-full font-bold uppercase ring-1 ring-inset ${
                   bill?.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 ring-green-600/20' : 
                   bill?.paymentStatus === 'partial' ? 'bg-yellow-50 text-yellow-600 ring-yellow-600/20' : 
                   'bg-red-50 text-red-600 ring-red-600/20'
                 }`}>
                   {bill?.paymentStatus}
                 </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Payment Collection (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handlePaidAmountChange}
                  max={bill?.totalAmount}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-black md:text-lg transition"
                />
                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Cannot exceed the total billing amount of ₹{bill?.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Updated Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-sm bg-white cursor-pointer"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="partial">🌓 Partial</option>
                  <option value="paid">✅ Paid</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-sm bg-white cursor-pointer"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="upi">📲 UPI</option>
                  <option value="insurance">🛡️ Insurance</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:flex-1 px-6 py-3.5 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition font-bold text-sm"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:transform-none"
              >
                {submitting ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     Updating Records...
                   </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Invoice Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditBill;
