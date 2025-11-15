import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "../App.css";

function GuardDashboard() {
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [localMessage, setLocalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("guardId");
    const token = localStorage.getItem("guardToken");

    if (!storedId || !token) {
      return navigate("/guard-login");
    }
    setUsername(storedId);

    fetch(`http://localhost:3000/guards/requests`, { method: "GET", headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json()).then(data => setRequests(data)).catch(err => { console.error(err); navigate('/guard-login'); });

    const handleLoginEvent = (e) => {
      const name = e.detail.username;
      setLocalMessage(`Hello ${name}!`);
      setTimeout(() => setLocalMessage(""), 1400);
    };
    window.addEventListener('login-event', handleLoginEvent);

    if (storedId) {
      setLocalMessage(`Hello ${storedId}!`);
      setTimeout(() => setLocalMessage(""), 1400);
    }

    return () => window.removeEventListener('login-event', handleLoginEvent);
  }, [navigate]);

  const handleLogout = () => {
    const uname = localStorage.getItem("username") || localStorage.getItem("guardId");
    setLocalMessage(`Goodbye ${uname}!`);

    window.dispatchEvent(new CustomEvent("logout-event", { detail: { username: uname } }));

    localStorage.removeItem("guardId");
    localStorage.removeItem("guardToken");
    localStorage.removeItem("username");

    setTimeout(() => navigate('/guard-login'), 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-6">
      {localMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 top-8 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl shadow-2xl text-lg font-semibold animate-fade-in z-50 border border-green-400">
          {localMessage}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl relative border border-green-100">
        <button onClick={handleLogout} className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300">
          Logout
        </button>
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-green-700 mb-2">Guard Dashboard</h1>
          <p className="text-gray-600 text-lg">ID: <span className="font-semibold text-green-600">{username}</span></p>
          <p className="text-gray-500 mt-1">Manage student gatepass requests efficiently</p>
        </div>

        <div className="text-left w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
          </div>
          
          <div className="space-y-4">
            {requests.length === 0 ? 
              <div className="text-center py-12 bg-green-50 rounded-2xl border-2 border-dashed border-green-200">
                <svg className="w-16 h-16 text-green-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No pending requests at the moment</p>
              </div>
              :
              requests.map(req => (
                <motion.div key={req._id} className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-md border border-green-100 hover:shadow-lg transition-all duration-300" whileHover={{ scale: 1.01 }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                          <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="font-bold text-lg text-gray-800">Student ID: <span className="text-green-600">{req.studentId}</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <p className="text-gray-700"><span className="font-semibold">Purpose:</span> {req.purpose}</p>
                        <p className="text-gray-700"><span className="font-semibold">Destination:</span> {req.destination}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-4">
                      <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                        Approve
                      </button>
                      <button className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default GuardDashboard;