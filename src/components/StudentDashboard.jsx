import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';
import Footer from './Footer';

function StudentDashboard() {
  const [username, setUsername] = useState('');
  const [gatepassRequests, setGatepassRequests] = useState([]);
  const [localMessage, setLocalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    const token = localStorage.getItem('studentToken');

    if (!storedId || !token) return navigate('/student-login');

    setUsername(storedId);

    // ❗ Show Hello message only ONCE after login
    const hasShownWelcome = localStorage.getItem("welcomeShown");

    if (!hasShownWelcome) {
      setLocalMessage(`Hello ${storedId}!`);
      setTimeout(() => setLocalMessage(""), 1400);

      localStorage.setItem("welcomeShown", "true");
    }

    // Fetch requests
    fetch(`https://gate-pass-management-system-95o7.onrender.com/student/requests`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setGatepassRequests(data))
      .catch(err => {
        console.error(err);
        navigate('/student-login');
      });

  }, [navigate]);


  const handleLogout = () => {
    const uname = localStorage.getItem("username") || localStorage.getItem("studentId");
    setLocalMessage(`Goodbye ${uname}!`);

    localStorage.removeItem('studentId');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('username');
    localStorage.removeItem("welcomeShown");

    setTimeout(() => navigate('/student-login'), 1400);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('studentToken');
    if (!confirm('Are you sure?')) return;

    try {
      const res = await fetch(`https://gate-pass-management-system-95o7.onrender.com/student/requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        setGatepassRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100">

      {/* Floating Hello/Goodbye Message */}
      {localMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 top-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-2xl text-lg font-semibold animate-fade-in z-50 border border-blue-400">
          {localMessage}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 font-sans">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl relative border border-blue-100">

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300">
            Logout
          </button>

          {/* Dashboard Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-blue-700 mb-2">Student Dashboard</h1>
            <p className="text-gray-600 text-lg">
              ID: <span className="font-semibold text-blue-600">{username}</span>
            </p>
            <p className="text-gray-500 mt-1">Manage your gatepass requests efficiently</p>
          </div>

          {/* Create Request Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/gatepass-form')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold mb-8 shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 mx-auto block">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Request</span>
            </div>
          </motion.button>

          {/* Request List */}
          <div className="text-left w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Your Requests</h2>
            </div>

            <div className="space-y-4">
              {/* No Requests */}
              {gatepassRequests.length === 0 ? (
                <div className="text-center py-12 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
                  <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No gatepass requests found</p>
                </div>
              ) : (
                gatepassRequests.map(request => (
                  <motion.div
                    key={request._id}
                    className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.01 }}>

                    {/* REQUEST CARD FIXED RESPONSIVE */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                      {/* LEFT SIDE */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-200 rounded-lg">
                            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="font-bold text-lg text-gray-800">
                            {new Date(request.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                          <p className="text-gray-700"><span className="font-semibold">Purpose:</span> {request.purpose}</p>
                          <p className="text-gray-700"><span className="font-semibold">Destination:</span> {request.destination}</p>
                          <p className="text-gray-700"><span className="font-semibold">Time:</span> {request.time}</p>
                          <p className="text-gray-700"><span className="font-semibold">Luggages:</span> {request.luggages}</p>
                        </div>
                      </div>

                      {/* RIGHT SIDE — STATUS + DELETE */}
                      <div className="flex items-center gap-3">

                        <span className={`px-5 py-2 rounded-xl text-sm font-bold shadow-md ${request.status === 'Approved'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : request.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          }`}>
                          {request.status}
                        </span>

                        <button
                          onClick={() => handleDelete(request._id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          title="Delete Request"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </motion.div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default StudentDashboard;
