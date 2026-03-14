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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Bill</h1>
          <p className="text-gray-600 mt-1">Create a new bill for patient services</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Patient</h2>
              <select
                value={formData.patientId}
                onChange={(e) => {
                  const patient = patients.find(p => p._id === e.target.value);
                  if (patient) handlePatientSelect(patient);
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Patient --</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.patientId} - {patient.userId?.name}
                  </option>
                ))}
              </select>

              {selectedPatient && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Patient:</span> {selectedPatient.userId?.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">ID:</span> {selectedPatient.patientId}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Phone:</span> {selectedPatient.userId?.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  + Add Service
                </button>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="Service name"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Description"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={service.amount}
                        onChange={(e) => handleServiceChange(index, 'amount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-1">
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="w-full px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee
                  </label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Services: ₹{services.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)} + 
                    Consultation: ₹{formData.consultationFee}
                  </p>
                </div>
                <p className="text-4xl font-bold text-blue-600">₹{calculateTotal()}</p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/billing')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedPatient}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Generating...' : 'Generate Bill'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default GenerateBill;
