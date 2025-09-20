"use client"
import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Video, MessageSquare } from 'lucide-react';

interface AppointmentBookingProps {
  userRole: 'student' | 'counselor' | 'admin';
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ userRole }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [appointmentType, setAppointmentType] = useState('individual');
  const [sessionMode, setSessionMode] = useState('in-person');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const counselors = [
   
    {
      id: '2',
      name: 'Dr. Arjun Patel',
      specializations: ['Relationship Issues', 'Social Anxiety', 'Study Stress'],
      rating: 4.9,
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Dr. Kavya Reddy',
      specializations: ['Cultural Conflicts', 'Self-esteem', 'Peer Pressure'],
      rating: 4.7,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Dr. Rajesh Kumar',
      specializations: ['Depression', 'Exam Anxiety', 'Adjustment Issues'],
      rating: 4.6,
      availability: ['Wednesday', 'Thursday', 'Friday'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const upcomingAppointments = [
    {
      id: '1',
      counselor: 'Dr. Priya Sharma',
      date: '2025-09-25',
      time: '2:00 PM',
      type: 'Individual Session',
      mode: 'In-person',
      status: 'confirmed'
    },
    {
      id: '2',
      counselor: 'Group Session',
      date: '2025-09-27',
      time: '4:00 PM',
      type: 'Stress Management Group',
      mode: 'Virtual',
      status: 'confirmed'
    }
  ];

  const handleBookAppointment = () => {
    // Handle appointment booking logic
    alert('Appointment booked successfully! You will receive a confirmation SMS and email shortly.');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Counseling Appointment Booking</h1>
        <p className="text-gray-600">Schedule confidential counseling sessions with our qualified mental health professionals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Type */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'individual', label: 'Individual Session', desc: 'One-on-one counseling' },
                { id: 'group', label: 'Group Session', desc: 'Small group therapy' },
                { id: 'crisis', label: 'Crisis Session', desc: 'Emergency support' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAppointmentType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    appointmentType === type.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{type.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Session Mode */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'in-person', label: 'In-Person', icon: MapPin, desc: 'Visit our campus office' },
                { id: 'video', label: 'Video Call', icon: Video, desc: 'Secure video session' },
                { id: 'phone', label: 'Phone Call', icon: Phone, desc: 'Audio only session' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSessionMode(mode.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    sessionMode === mode.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <mode.icon className={`w-5 h-5 mb-2 ${
                    sessionMode === mode.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-gray-800">{mode.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Counselor Selection */}
          {appointmentType === 'individual' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Counselor</h3>
              <div className="space-y-4">
                {counselors.map((counselor) => (
                  <div
                    key={counselor.id}
                    onClick={() => setSelectedCounselor(counselor.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedCounselor === counselor.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={counselor.image}
                        alt={counselor.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{counselor.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Specializes in: {counselor.specializations.join(', ')}
                        </p>
                        <div className="flex items-center">
                          <div className="flex items-center text-yellow-500 mr-2">
                            ★★★★★
                          </div>
                          <span className="text-sm text-gray-600">{counselor.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date and Time Selection */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Options */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Book anonymously (your identity will be protected from other students)
              </span>
            </label>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookAppointment}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Book Appointment
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">{appointment.counselor}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {appointment.mode}
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                      Reschedule
                    </button>
                    <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All sessions are strictly confidential</li>
              <li>• Cancel at least 24 hours in advance</li>
              <li>• Emergency support available 24/7</li>
              <li>• First session is free for all students</li>
              <li>• Sessions available in Hindi and English</li>
            </ul>
          </div>

          {/* Crisis Support */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Need Immediate Help?</h4>
            <p className="text-sm text-red-700 mb-3">
              If you're having thoughts of self-harm or are in crisis, don't wait for an appointment.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors text-sm">
                Crisis Helpline: 9152987821
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded transition-colors text-sm">
                Vandrevala Foundation: 9999666555
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;