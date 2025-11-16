import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function GuardDashboard() {
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [localMessage, setLocalMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("guardId");
    const token = localStorage.getItem("guardToken");

    if (!storedId || !token) {
      return navigate("/guard-login");
    }
    setUsername(storedId);
    fetchRequests(token);

    const handleLoginEvent = (e) => {
      const name = e.detail.username;
      showMessage(`Hello ${name}!`, "success");
    };
    window.addEventListener('login-event', handleLoginEvent);

    if (storedId) {
      showMessage(`Hello ${storedId}!`, "success");
    }

    return () => window.removeEventListener('login-event', handleLoginEvent);
  }, [navigate]);

  const fetchRequests = async (token) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/guards/requests`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to fetch requests");
      
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      showMessage("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = "success") => {
    setLocalMessage(msg);
    setMessageType(type);
    setTimeout(() => setLocalMessage(""), 3000);
  };

  const handleApprove = async (requestId) => {
    const token = localStorage.getItem("guardToken");
    setProcessingId(requestId);
    
    try {
      const res = await fetch(`http://localhost:3000/guards/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to approve request");
      
      setRequests(prev => prev.filter(r => r._id !== requestId));
      showMessage("✓ Request approved successfully!", "success");
    } catch (err) {
      console.error(err);
      showMessage("✗ Failed to approve request", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const token = localStorage.getItem("guardToken");
    setProcessingId(requestId);
    
    try {
      const res = await fetch(`http://localhost:3000/guards/requests/${requestId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to reject request");
      
      setRequests(prev => prev.filter(r => r._id !== requestId));
      showMessage("Request rejected", "info");
    } catch (err) {
      console.error(err);
      showMessage("✗ Failed to reject request", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    const uname = localStorage.getItem("username") || localStorage.getItem("guardId");
    showMessage(`Goodbye ${uname}!`, "info");

    window.dispatchEvent(new CustomEvent("logout-event", { detail: { username: uname } }));

    localStorage.removeItem("guardId");
    localStorage.removeItem("guardToken");
    localStorage.removeItem("username");

    setTimeout(() => navigate('/guard-login'), 1400);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const messageColors = {
    success: "from-green-600 to-green-700 border-green-400",
    error: "from-red-600 to-red-700 border-red-400",
    info: "from-blue-600 to-blue-700 border-blue-400"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-start p-6 pt-20">
      <AnimatePresence>
        {localMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed left-1/2 -translate-x-1/2 top-8 bg-gradient-to-r ${messageColors[messageType]} text-white px-8 py-4 rounded-2xl shadow-2xl text-lg font-semibold z-50 border`}
          >
            {localMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-6xl relative border border-green-100"
      >
        <button 
          onClick={handleLogout} 
          className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
        >
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-full">
              <span className="text-green-700 font-semibold">{requests.length} pending</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-gray-500 mt-4">Loading requests...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {requests.length === 0 ? 
                <div className="text-center py-12 bg-green-50 rounded-2xl border-2 border-dashed border-green-200">
                  <svg className="w-16 h-16 text-green-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No pending requests at the moment</p>
                </div>
                :
                requests.map((req, index) => (
                  <motion.div 
                    key={req._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-md border border-green-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        {/* Header with Student Info */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-green-200">
                          <div className="p-2 bg-green-200 rounded-lg">
                            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-xl text-gray-800">{req.name || 'N/A'}</p>
                            <p className="text-sm text-gray-600">
                              ID: <span className="text-green-600 font-semibold">{req.studentId}</span>
                              {req.hostelBlock && <span> • Block: <span className="text-green-600 font-semibold">{req.hostelBlock}</span></span>}
                            </p>
                          </div>
                        </div>

                        {/* Journey Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg border border-green-100">
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Date of Journey</p>
                            <p className="text-gray-800 font-semibold">{formatDate(req.date)}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100">
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Time of Leaving</p>
                            <p className="text-gray-800 font-semibold">{req.time || 'N/A'}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100">
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Destination</p>
                            <p className="text-gray-800 font-semibold">{req.destination || 'N/A'}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100">
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Luggage</p>
                            <p className="text-gray-800 font-semibold">{req.luggages || 'None'}</p>
                          </div>
                        </div>

                        {/* Purpose Section */}
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Purpose of Visit</p>
                          <p className="text-gray-800 leading-relaxed">{req.purpose || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 pt-1">
                        <button 
                          onClick={() => handleApprove(req._id)}
                          disabled={processingId === req._id}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === req._id ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              Processing
                            </span>
                          ) : (
                            <>✓ Approve</>
                          )}
                        </button>
                        <button 
                          onClick={() => handleReject(req._id)}
                          disabled={processingId === req._id}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default GuardDashboard;