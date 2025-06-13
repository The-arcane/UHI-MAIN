import React, { useState, useEffect } from 'react';
import { Calendar, Activity, MapPin, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const { addToCart } = useCart();

  const [appointments, setAppointments] = useState([]);
  const [prescriptionAvailable, setPrescriptionAvailable] = useState(false);
  const [prescriptionDownloaded, setPrescriptionDownloaded] = useState(false);
  const [labTestsFetched, setLabTestsFetched] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);

  useEffect(() => {
    const alreadyFetched = localStorage.getItem('patientDashboardFetched');

    if (!alreadyFetched) {
      setTimeout(() => {
        setPrescriptionAvailable(true);
        setLabTestsFetched(true);
        fetchAppointment();
        toast.info("Prescription and Lab tests fetched.");
        localStorage.setItem('patientDashboardFetched', 'true');
      }, 1000); // 1 second delay
    } else {
      setPrescriptionAvailable(true);
      setLabTestsFetched(true);
      fetchAppointment();
    }
  }, []);

  const fetchAppointment = () => {
    const newAppointments = [
      {
        id: Date.now(),
        doctorName: 'Dr. MK Chaubey',
        specialty: 'Cardiology',
        date: '2025-06-14',
        time: '05:00 PM',
        type: 'video',
        status: 'upcoming'
      },
      {
        id: Date.now() + 1,
        doctorName: 'Dr. MK Chaubey',
        specialty: 'Cardiology',
        date: '2025-06-16',
        time: '09:00 AM',
        type: 'video',
        status: 'upcoming'
      }
    ];
    setAppointments(newAppointments);
  };

  const downloadPrescription = async () => {
    try {
      const response = await fetch('/prescription.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'prescription.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setPrescriptionDownloaded(true);
      toast.success('Prescription downloaded!');
    } catch (err) {
      console.error('Failed to download prescription:', err);
      toast.error('Failed to download prescription.');
    }
  };

  const orderMedicines = () => {
    const prescriptionMeds = [
      { id: 1, name: 'Angispan TR 2.5mg', price: 50, type: 'medicine', requiresPrescription: false },
      { id: 2, name: 'Nicodil 5', price: 120, type: 'medicine', requiresPrescription: false },
      { id: 3, name: 'Dytor Plus 10', price: 85, type: 'medicine', requiresPrescription: false },
      { id: 4, name: 'Lipvas 40', price: 45, type: 'medicine', requiresPrescription: false }
    ];
    prescriptionMeds.forEach(med => addToCart(med));
    toast.success('Prescription medicines added to cart!');
  };

  const handleAIAnalysis = () => {
    setAiLoading(true);
    setShowAIReport(false);
    setTimeout(() => {
      setAiLoading(false);
      setShowAIReport(true);
    }, 5000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Patient Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-md">
          <Calendar className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments</p>
          ) : (
            appointments.map(appt => (
              <div key={appt.id} className="mb-2">
                <p className="font-semibold">{appt.doctorName} - {appt.specialty}</p>
                <p className="text-sm text-gray-600">{appt.date} at {appt.time}</p>
                {appt.type === 'video' && (
                  <Link to={`/video-call/${appt.id}`} className="text-green-600 hover:underline text-sm">
                    Join Video Call
                  </Link>
                )}
              </div>
            ))
          )}
        </motion.div>

        {/* Prescription */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-md">
          <Activity className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Prescription</h3>
          {!prescriptionAvailable ? (
            <p className="text-gray-500">Doctor hasn't sent prescription yet</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Date Issued: 2025-06-05</p>
              <p className="text-sm text-gray-600">Time: 12:00 PM</p>
              {!prescriptionDownloaded && (
                <button onClick={downloadPrescription} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Download Prescription
                </button>
              )}
              <button onClick={orderMedicines} className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Order Medicines
              </button>
            </div>
          )}
        </motion.div>

        {/* Lab Tests */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-md">
          <MapPin className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Upcoming Lab Tests</h3>
          {!labTestsFetched ? (
            <p className="text-gray-500">No lab tests booked</p>
          ) : (
            <>
              <p className="text-gray-700">2 tests scheduled at <strong>HOD</strong></p>
              <p className="text-sm text-gray-600">Date: 2025-06-16</p>
              <p className="text-sm text-gray-600">Time: 12:00 PM</p>
              <a href="https://www.google.com/maps/dir//HOD+Blood+Test+Centre,+Shop+No-1,+Ground+Floor,+C-1%2F49,+Sector+5,+Rohini,+New+Delhi,+Delhi+110085" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                View on Google Maps
              </a>
            </>
          )}
        </motion.div>
      </div>

      {/* AI Health Analytics */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold">Health Analytics</h3>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
          <li>Last visit: June 1, 2025</li>
          <li>Avg. BP: 120/80 mmHg</li>
          <li>Cholesterol: 180 mg/dL</li>
          <li>Heart Rate: 72 bpm</li>
        </ul>
        <button
          onClick={handleAIAnalysis}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Detailed Analysis
        </button>

        {aiLoading && (
          <p className="mt-4 text-sm text-gray-500 italic">MediBot is analyzing your health data...</p>
        )}

        {showAIReport && (
          <div className="mt-4 text-sm text-gray-800 space-y-2">
            <p><strong>AI Summary:</strong></p>
            <p>
              Based on your latest vitals and prescription data, your cardiac health appears to be stable.
              Your average blood pressure reading of 120/80 mmHg is within the optimal range, indicating
              a healthy circulatory system. Your heart rate of 72 bpm is also normal, suggesting effective
              cardiovascular performance without signs of arrhythmia or stress-related elevation.
            </p>
            <p>
              Cholesterol levels are well-managed at 180 mg/dL, reducing the risk of plaque buildup in
              arteries. Your prescribed medications are consistent with maintenance therapy for individuals
              with prior cardiovascular concerns, such as Angispan TR for chest pain and Lipvas to control
              cholesterol.
            </p>
            <p>
              Overall, your current regimen is helping maintain a balanced cardiac profile. Continue regular
              monitoring and follow-up with your cardiologist, maintain a heart-friendly diet, and ensure
              consistent physical activity to support long-term health outcomes.
            </p>
            <p className="text-right italic text-xs text-gray-500 mt-2">— Powered by MediBot by UHI Care</p>
          </div>
        )}

        
      </motion.div>
    </motion.div>
  );
};

export default PatientDashboard;
