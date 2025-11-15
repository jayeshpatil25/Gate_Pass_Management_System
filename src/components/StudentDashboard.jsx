import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';

function StudentDashboard() {
  const [username, setUsername] = useState('');
  const [gatepassRequests, setGatepassRequests] = useState([]);
  const [localMessage, setLocalMessage] = useState("");   // shows Hello/Goodbye on dashboard
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    const token = localStorage.getItem('studentToken');

    if (!storedId || !token) {
      return navigate('/student-login');
    }

    setUsername(storedId);

    fetch(`http://localhost:3000/student/requests`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setGatepassRequests(data))
      .catch(err => {
        console.error(err);
        navigate('/student-login');
      });

    // listener for login-event (custom event communication)
    const handleLoginEvent = (e) => {
      const name = e.detail.username;
      setLocalMessage(`Hello ${name}!`);
      setTimeout(() => setLocalMessage(""), 1400);
    };
    window.addEventListener('login-event', handleLoginEvent);

    // Fallback: if mounted and username present, show hello briefly
    if (storedId) {
      setLocalMessage(`Hello ${storedId}!`);
      setTimeout(() => setLocalMessage(""), 1400);
    }

    return () => window.removeEventListener('login-event', handleLoginEvent);
  }, [navigate]);

  const handleLogout = () => {
    const uname = localStorage.getItem("username") || localStorage.getItem("studentId");
    // show goodbye locally
    setLocalMessage(`Goodbye ${uname}!`);

    // fire logout-event (for login page to listen)
    window.dispatchEvent(new CustomEvent("logout-event", { detail: { username: uname } }));

    localStorage.removeItem('studentId');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('username');

    setTimeout(() => navigate('/student-login'), 1400);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('studentToken');
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`http://localhost:3000/student/requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setGatepassRequests(prev => prev.filter(r => r._id !== id));
      else alert(data.error || 'Delete failed');
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-blue-100 flex flex-col items-center justify-center p-6 font-sans">
      {/* floating message */}
      {localMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 top-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold animate-fade-in z-50">
          {localMessage}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl text-center relative">
        <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">Logout</button>
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Welcome, Student Id: {username}</h1>
        <p className="text-gray-600 mb-6">Manage your gatepass requests and view their status.</p>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/gatepass-form')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold mb-8 shadow hover:bg-blue-700 transition">
          Create Gatepass Request
        </motion.button>

        <div className="text-left w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Requests</h2>
          <div className="space-y-4">
            {gatepassRequests.length === 0 ? <p className="text-gray-500">No gatepass requests found.</p> :
              gatepassRequests.map(request => (
                <motion.div key={request._id} className="p-4 bg-slate-50 rounded-lg shadow-md flex justify-between items-center" whileHover={{ scale: 1.02 }}>
                  <div>
                    <p className="font-medium">Request Date: {new Date(request.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Purpose: {request.purpose}</p>
                    <p className="text-sm text-gray-500">Destination: {request.destination}</p>
                    <p className="text-sm text-gray-500">Time: {request.time}</p>
                    <p className="text-sm text-gray-500">Luggages: {request.luggages}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      request.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        request.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {request.status}
                    </span>
                    <button onClick={() => handleDelete(request._id)} className="text-red-600 hover:text-red-800 font-bold text-lg" title="Delete Request">🗑</button>
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

export default StudentDashboard;
