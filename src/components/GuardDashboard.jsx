import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

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

    if (!storedId || !token) return navigate("/guard-login");

    setUsername(storedId);
    fetchRequests(token);

    setLocalMessage(`Hello ${storedId}!`);
    setMessageType("success");

    setTimeout(() => setLocalMessage(""), 2000);
  }, []);

  const fetchRequests = async (token) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/guards/requests`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setRequests(data);
    } catch (err) {
      setLocalMessage("Failed to load requests");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = "success") => {
    setLocalMessage(msg);
    setMessageType(type);
    setTimeout(() => setLocalMessage(""), 2000);
  };

  const handleApprove = async (requestId) => {
    const token = localStorage.getItem("guardToken");
    setProcessingId(requestId);

    try {
      const res = await fetch(
        `http://localhost:3000/guards/requests/${requestId}/approve`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error();

      setRequests(prev => prev.filter(r => r._id !== requestId));
      showMessage("Request approved ✓", "success");
    } catch {
      showMessage("Failed to approve", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const token = localStorage.getItem("guardToken");
    setProcessingId(requestId);

    try {
      const res = await fetch(
        `http://localhost:3000/guards/requests/${requestId}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error();

      setRequests(prev => prev.filter(r => r._id !== requestId));
      showMessage("Request rejected", "info");
    } catch {
      showMessage("Failed to reject", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const messageColors = {
    success: "from-green-600 to-green-700 border-green-400",
    error: "from-red-600 to-red-700 border-red-400",
    info: "from-blue-600 to-blue-700 border-blue-400",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

      {/* Toast Message */}
      <AnimatePresence>
        {localMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed left-1/2 -translate-x-1/2 top-6 text-white px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r ${messageColors[messageType]} border z-50`}
          >
            {localMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex justify-center items-start p-6 pt-24">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl relative border border-green-100"
        >

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("guardToken");
              localStorage.removeItem("guardId");
              navigate("/guard-login");
            }}
            className="absolute top-6 right-6 bg-red-500 text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-red-600"
          >
            Logout
          </button>

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-green-700 mb-2">Guard Dashboard</h1>
            <p className="text-gray-600">ID: {username}</p>
          </div>

          {/* TITLE ROW */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-green-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">Pending Requests</h2>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-full text-green-700 font-semibold">
              {requests.length} pending
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : (

            /* REQUEST LIST */
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">

              {requests.length === 0 ? (
                <div className="text-center p-10 text-gray-500 bg-green-50 border border-dashed border-green-200 rounded-xl">
                  No pending requests
                </div>
              ) : (

                requests.map((req, index) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow border border-green-100"
                  >

                    {/* Request Card */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                      {/* LEFT */}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {req.studentName || "Student"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          <span className="font-semibold">Date:</span> {new Date(req.date).toDateString()}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-semibold">Purpose:</span> {req.purpose}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-semibold">Destination:</span> {req.destination}
                        </p>
                      </div>

                      {/* RIGHT BUTTONS */}
                      <div className="flex gap-2">
                        <button
                          disabled={processingId === req._id}
                          onClick={() => handleApprove(req._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm shadow"
                        >
                          {processingId === req._id ? "..." : "Approve"}
                        </button>

                        <button
                          disabled={processingId === req._id}
                          onClick={() => handleReject(req._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm shadow"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default GuardDashboard;
