import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import api from '../utils/api';

const GenerateBill = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [services, setServices] = useState([{ name: '', description: '', amount: 0 }]);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    consultationFee: 0,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsRes, appointmentsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/appointments'),
      ]);
      setPatients(patientsRes.data.data || []);
      setAppointments(appointmentsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData({ ...formData, patientId: patient._id });
    
    // Filter appointments for this patient
    const patientAppointments = appointments.filter(
      apt => apt.patientId?._id === patient._id && apt.status === 'completed'
    );
    
    if (patientAppointments.length > 0) {
      const apt = patientAppointments[0];
      setSelectedAppointment(apt);
      setFormData({
        ...formData,
        patientId: patient._id,
        appointmentId: apt._id,
        consultationFee: apt.doctorId?.consultationFee || 0,
      });
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { name: '', description: '', amount: 0 }]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const servicesTotal = services.reduce((sum, service) => sum + (parseFloat(service.amount) || 0), 0);
    return servicesTotal + (parseFloat(formData.consultationFee) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const billData = {
        patientId: formData.patientId,
        services: services.filter(s => s.name && parseFloat(s.amount) > 0).map(s => ({
          ...s,
          amount: parseFloat(s.amount)
        })),
        consultationFee: parseFloat(formData.consultationFee) || 0,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        totalAmount: calculateTotal(),
        paidAmount: formData.paymentStatus === 'paid' ? calculateTotal() : 0,
      };

      // Only add appointmentId if it's not empty/null
      if (formData.appointmentId) {
        billData.appointmentId = formData.appointmentId;
      }

      await api.post('/bills', billData);
      alert('Bill generated successfully!');
      navigate('/admin/billing');
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Failed to generate bill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="px-1 sm:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Generate Bill</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Create a new bill for patient services</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading clinical data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Patient Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span> Select Patient
              </h2>
              <select
                value={formData.patientId}
                onChange={(e) => {
                  const patient = patients.find(p => p._id === e.target.value);
                  if (patient) handlePatientSelect(patient);
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
              >
                <option value="">-- Choose Patient Record --</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.patientId} - {patient.userId?.name}
                  </option>
                ))}
              </select>

              {selectedPatient && (
                <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Patient Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedPatient.userId?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Hospital ID</p>
                      <p className="text-sm font-bold text-gray-900">{selectedPatient.patientId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-gray-900">{selectedPatient.userId?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">🛠️</span> Itemized Services
                </h2>
                <button
                  type="button"
                  onClick={addService}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="text-lg">+</span> Add Line Item
                </button>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 group relative">
                    <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                      <div className="flex-1">
                        <label className="block md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Name</label>
                        <input
                          type="text"
                          placeholder="Service name (e.g. X-Ray)"
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="flex-[1.5]">
                        <label className="block md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="Additional details"
                          value={service.description}
                          onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={service.amount}
                          onChange={(e) => handleServiceChange(index, 'amount', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 md:pt-0">
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group-hover:text-red-600"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">💳</span> Billing & Payment
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Consultation Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="upi">📲 UPI</option>
                    <option value="insurance">🛡️ Insurance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    initial Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="paid">✅ Paid</option>
                    <option value="partial">🌓 Partial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg border border-transparent p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
                <div className="text-center sm:text-left">
                  <p className="text-blue-100/80 font-bold text-xs uppercase tracking-[0.2em] mb-1">Grand Total Calculation</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-2 text-[10px] md:text-xs text-blue-100/60 font-medium">
                    <span>Services: ₹{services.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0).toLocaleString()}</span>
                    <span>•</span>
                    <span>Consultation: ₹{Number(formData.consultationFee).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                   <p className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-sm">₹{calculateTotal().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/billing')}
                className="w-full sm:w-auto px-8 py-3.5 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm"
              >
                Cancel Process
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedPatient}
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:transform-none"
              >
                {submitting ? (
                   <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     Finalizing...
                   </span>
                ) : 'Confirm & Generate Invoice'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default GenerateBill;
