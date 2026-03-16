import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: {
      startTime: '',
      endTime: '',
    },
    symptoms: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({ ...prev, doctorId: doctor._id }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeSlotChange = (field, value) => {
    setFormData({
      ...formData,
      timeSlot: { ...formData.timeSlot, [field]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/appointments', formData);
      setSuccess(true);
      // Reset form
      setFormData({
        doctorId: '',
        date: '',
        timeSlot: { startTime: '', endTime: '' },
        symptoms: '',
        notes: '',
      });
      setSelectedDoctor(null);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="px-1 sm:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Schedule a consultation with our doctors</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-5 shadow-sm animate-pulse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-800 font-bold text-sm md:text-base">Appointment booked successfully!</p>
            </div>
          </div>
        )}

        {/* Doctor Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Select Doctor</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium mt-4">Finding available doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-medium">No doctors available today</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor._id}
                  type="button"
                  onClick={() => handleDoctorSelect(doctor)}
                  className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 group relative ${
                    selectedDoctor?._id === doctor._id
                      ? 'border-blue-600 bg-blue-50 shadow-md ring-1 ring-blue-600'
                      : 'border-gray-100 bg-gray-50 hover:border-blue-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-bold text-base md:text-lg">
                        {doctor.userId?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition truncate pr-6">{doctor.userId?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600 font-medium truncate">{doctor.specialization}</p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">{doctor.qualification}</p>
                      <p className="text-xs md:text-sm font-bold text-blue-600 mt-2">
                        ₹{doctor.consultationFee} <span className="font-normal text-gray-400">Fee</span>
                      </p>
                    </div>
                    {selectedDoctor?._id === doctor._id && (
                      <div className="absolute top-4 right-4 text-blue-600">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Appointment Form */}
        {selectedDoctor && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-5 animate-in fade-in duration-500">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Appointment Details</h2>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm md:text-base"
              />
            </div>

            {/* Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.timeSlot.startTime}
                  onChange={(e) => handleTimeSlotChange('startTime', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.timeSlot.endTime}
                  onChange={(e) => handleTimeSlotChange('endTime', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm md:text-base"
                />
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Symptoms *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Briefly describe your current health concerns..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm md:text-base resize-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any past records or specific requests..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm md:text-base resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
              <div className="text-center sm:text-left bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 w-full sm:w-auto">
                <p className="text-sm font-bold text-blue-900">Total Due: ₹{selectedDoctor.consultationFee}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Pay at Reception</p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default BookAppointment;
