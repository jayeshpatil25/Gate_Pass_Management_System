import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';

function StudentDashboard() {
  const [username, setUsername] = useState('');
  const [gatepassRequests, setGatepassRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    const token = localStorage.getItem('studentToken');

    if (!storedId || !token) {
      alert("You are not logged in. Please login again.");
      return navigate('/student-login');
    }

    setUsername(storedId);

    fetch(`http://localhost:3000/student/requests`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched gatepass requests:', data);
        setGatepassRequests(data);
      })
      .catch((err) => {
        console.error('Error fetching gatepass requests:', err);
        alert("Something went wrong or your session expired. Please login again.");
        navigate('/student-login');
      });
  }, [navigate]);

  // Updated logout: set logoutMessage then clear credentials and redirect
  const handleLogout = () => {
    const uname = localStorage.getItem("username") || localStorage.getItem("studentId");
    if (uname) {
      localStorage.setItem("logoutMessage", `Goodbye ${uname}!`);
    }

    localStorage.removeItem('studentId');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('username');

    navigate('/student-login');
  };

  // 🗑️ DELETE Feature — delete a request
  const handleDelete = async (id) => {
    const token = localStorage.getItem('studentToken');
    if (!window.confirm('Are you sure you want to delete this gatepass request?')) return;

    try {
      const res = await fetch(`http://localhost:3000/student/requests/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Gatepass request deleted successfully.');
        // Update frontend list
        setGatepassRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        alert(data.error || 'Failed to delete request.');
      }
    } catch (err) {
      console.error('Error deleting gatepass:', err);
      alert('Server error while deleting.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-blue-100 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl text-center relative"
      >
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Logout
        </button>

        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">
          Welcome, Student Id: {username}
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your gatepass requests and view their status.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/gatepass-form')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold mb-8 shadow hover:bg-blue-700 transition"
        >
          Create Gatepass Request
        </motion.button>

        <div className="text-left w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Requests</h2>
          <div className="space-y-4">
            {gatepassRequests.length === 0 ? (
              <p className="text-gray-500">No gatepass requests found.</p>
            ) : (
              gatepassRequests.map((request) => (
                <motion.div
                  key={request._id}
                  className="p-4 bg-slate-50 rounded-lg shadow-md flex justify-between items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="font-medium">
                      Request Date: {new Date(request.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Purpose: {request.purpose}</p>
                    <p className="text-sm text-gray-500">Destination: {request.destination}</p>
                    <p className="text-sm text-gray-500">Time: {request.time}</p>
                    <p className="text-sm text-gray-500">Luggages: {request.luggages}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        request.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : request.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {request.status}
                    </span>

                    {/* 🗑️ Delete Button */}
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="text-red-600 hover:text-red-800 font-bold text-lg"
                      title="Delete Request"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentDashboard;
