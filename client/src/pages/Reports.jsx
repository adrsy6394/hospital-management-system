import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalStaff: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    recentAppointments: [],
    recentBills: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [patientsRes, doctorsRes, staffRes, appointmentsRes, billsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/staff'),
        api.get('/appointments'),
        api.get('/bills')
      ]);

      // Calculate Revenue from paid bills (field is paymentStatus, not status)
      const bills = billsRes.data.data || [];
      const totalRevenue = bills.reduce((acc, bill) => {
        return bill.paymentStatus === 'paid' ? acc + (bill.totalAmount || 0) : acc;
      }, 0);

      // Sort recent arrays by date
      const sortedAppointments = (appointmentsRes.data.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      const sortedBills = bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReportData({
        totalPatients: patientsRes.data.count || 0,
        totalDoctors: doctorsRes.data.count || 0,
        totalStaff: staffRes.data.count || 0,
        totalAppointments: appointmentsRes.data.count || 0,
        totalRevenue,
        recentAppointments: sortedAppointments.slice(0, 5), // Top 5
        recentBills: sortedBills.slice(0, 5) // Top 5
      });

    } catch (error) {
      console.error('Error fetching dashboard reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Compiling reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hospital Analytics & Reports</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Real-time overview of hospital operations and finances</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center shadow-sm text-sm"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Global Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 border-l-4 border-l-blue-500">
            <p className="text-[10px] md:text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">₹{reportData.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 border-l-4 border-l-indigo-500">
            <p className="text-[10px] md:text-sm font-medium text-gray-500 mb-1">Total Patients</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{reportData.totalPatients}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 border-l-4 border-l-green-500">
            <p className="text-[10px] md:text-sm font-medium text-gray-500 mb-1">Total Doctors</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{reportData.totalDoctors}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 border-l-4 border-l-yellow-500">
            <p className="text-[10px] md:text-sm font-medium text-gray-500 mb-1">Total Staff</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{reportData.totalStaff}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 border-l-4 border-l-purple-500 col-span-2 lg:col-span-1">
            <p className="text-[10px] md:text-sm font-medium text-gray-500 mb-1">All Appointments</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{reportData.totalAppointments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments Report */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Appointments</h2>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-gray-200">
                {reportData.recentAppointments.length > 0 ? reportData.recentAppointments.map(app => (
                  <li key={app._id} className="p-4 md:p-5 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Patient: {app.patientId?.userId?.name || 'Unknown'}</p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 truncate">Dr. {app.doctorId?.userId?.name || 'Unknown'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] md:text-xs font-medium capitalize shadow-sm
                          ${app.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                          ${app.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${app.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {app.status}
                        </span>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                          {new Date(app.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                )) : (
                  <div className="p-6 text-center text-gray-500 text-sm">No recent appointments found.</div>
                )}
              </ul>
            </div>
          </div>

          {/* Recent Billing Report */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-gray-200">
                {reportData.recentBills.length > 0 ? reportData.recentBills.map(bill => (
                  <li key={bill._id} className="p-4 md:p-5 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center min-w-0">
                        <div className={`w-1.5 h-8 md:w-2 md:h-10 rounded-full mr-3 flex-shrink-0 ${bill.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">Bill: {bill.billId}</p>
                          <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 truncate">{bill.patientId?.userId?.name || 'Unknown Patient'}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm md:text-base font-bold text-gray-900">₹{bill.totalAmount.toLocaleString()}</p>
                        <p className={`text-[10px] md:text-xs font-semibold capitalize mt-0.5 ${bill.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {bill.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </li>
                )) : (
                  <div className="p-6 text-center text-gray-500 text-sm">No recent billing data found.</div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
