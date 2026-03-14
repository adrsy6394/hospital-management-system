import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const BillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bills/${id}`);
      setBill(response.data.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

  if (!bill) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-900">Bill not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 print:m-0 print:p-0">
        {/* Header - Hidden on Print */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Print Bill
            </button>
            <button
              onClick={() => navigate(`/admin/billing/edit/${bill._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Bill
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border-0 print:shadow-none">
          {/* Bill Header */}
          <div className="bg-gray-50 p-8 border-b border-gray-200 flex justify-between items-start print:bg-white">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
              <p className="text-gray-600 mt-2">Bill ID: <span className="font-bold">{bill.billId}</span></p>
              <p className="text-gray-600">Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">Hospital Management</h2>
              <p className="text-gray-600">123 Health Street, Medical City</p>
              <p className="text-gray-600">Phone: +1 (234) 567-890</p>
              <p className="text-gray-600">Email: contact@hospital.com</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To:</h3>
                <p className="text-lg font-bold text-gray-900">{bill.patientId?.userId?.name}</p>
                <p className="text-gray-600">Patient ID: {bill.patientId?.patientId}</p>
                <p className="text-gray-600">Phone: {bill.patientId?.userId?.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Details:</h3>
                <p className="text-gray-600">Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold capitalize ${
                    bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                    bill.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {bill.paymentStatus}
                  </span>
                </p>
                <p className="text-gray-600 mt-1">Method: <span className="capitalize">{bill.paymentMethod}</span></p>
              </div>
            </div>

            {/* Services Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Consultation Fee</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Doctor professional fees</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">₹{bill.consultationFee.toLocaleString()}</td>
                  </tr>
                  {bill.services?.map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{service.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{service.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">₹{service.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-right font-bold text-gray-900">Total Amount</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600 text-xl">₹{bill.totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-right text-sm text-gray-600">Paid Amount</td>
                    <td className="px-6 py-4 text-right text-sm text-green-600 font-bold">₹{bill.paidAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan="2" className="px-6 py-4 text-right text-sm text-gray-600">Due Amount</td>
                    <td className="px-6 py-4 text-right text-sm text-red-600 font-bold">₹{(bill.totalAmount - bill.paidAmount).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer Note */}
            <div className="pt-8 text-center border-t border-gray-100">
              <p className="text-gray-500 text-sm">Thank you for your visit. Take care!</p>
              <p className="text-gray-400 text-xs mt-1">This is a computer-generated invoice.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BillDetails;
