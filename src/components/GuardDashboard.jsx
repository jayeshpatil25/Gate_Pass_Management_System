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

    // listen for login-event (custom event)
    const handleLoginEvent = (e) => {
      const name = e.detail.username;
      setLocalMessage(`Hello ${name}!`);
      setTimeout(() => setLocalMessage(""), 1400);
    };
    window.addEventListener('login-event', handleLoginEvent);

    // fallback display
    if (storedId) {
      setLocalMessage(`Hello ${storedId}!`);
      setTimeout(() => setLocalMessage(""), 1400);
    }

    return () => window.removeEventListener('login-event', handleLoginEvent);
  }, [navigate]);

  const handleLogout = () => {
    const uname = localStorage.getItem("username") || localStorage.getItem("guardId");
    setLocalMessage(`Goodbye ${uname}!`);

    // dispatch logout-event
    window.dispatchEvent(new CustomEvent("logout-event", { detail: { username: uname } }));

    localStorage.removeItem("guardId");
    localStorage.removeItem("guardToken");
    localStorage.removeItem("username");

    setTimeout(() => navigate('/guard-login'), 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
      {localMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 top-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold animate-fade-in z-50">
          {localMessage}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl text-center relative">
        <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">Logout</button>
        <h1 className="text-3xl font-extrabold text-green-700 mb-2">Welcome, Guard ID: {username}</h1>
        <p className="text-gray-600 mb-6">Approve or reject student gatepass requests.</p>

        <div className="text-left w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {requests.length === 0 ? <p className="text-gray-500">No requests found.</p> :
              requests.map(req => (
                <motion.div key={req._id} className="p-4 bg-emerald-50 rounded-lg shadow-md flex justify-between items-center" whileHover={{ scale: 1.02 }}>
                  <div>
                    <p className="font-medium">Student ID: {req.studentId}</p>
                    <p className="text-sm text-gray-600">Purpose: {req.purpose}</p>
                    <p className="text-sm text-gray-600">Destination: {req.destination}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">Approve</button>
                    <button className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Reject</button>
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
