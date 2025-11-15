import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "../App.css";

function GuardDashboard() {
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [localMessage, setLocalMessage] = useState(""); // ⭐ Goodbye message
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("guardId");
    const token = localStorage.getItem("guardToken");

    if (!storedId || !token) {
      alert("You are not logged in. Please login again.");
      return navigate("/guard-login");
    }

    setUsername(storedId);

    fetch(`http://localhost:3000/guards/requests`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched guard requests:", data);
        setRequests(data);
      })
      .catch((err) => {
        console.error("Error fetching:", err);
        alert("Session expired. Please login again.");
        navigate("/guard-login");
      });
  }, [navigate]);

  // ⭐ Logout logic EXACTLY like Student but for Guard
  const handleLogout = () => {
    const uname =
      localStorage.getItem("username") || localStorage.getItem("guardId");

    // ⭐ Show Goodbye message on THIS screen (dashboard)
    setLocalMessage(`Goodbye ${uname}!`);

    // ⭐ Fire custom event (IWP requirement)
    window.dispatchEvent(
      new CustomEvent("logout-event", {
        detail: { username: uname },
      })
    );

    // Clear stored credentials
    localStorage.removeItem("guardId");
    localStorage.removeItem("guardToken");
    localStorage.removeItem("username");

    // ⭐ Delay so message is visible before redirect
    setTimeout(() => {
      navigate("/guard-login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">

      {/* ⭐ Goodbye Message */}
      {localMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 top-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold animate-fade-in z-50">
          {localMessage}
        </div>
      )}

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

        <h1 className="text-3xl font-extrabold text-green-700 mb-2">
          Welcome, Guard ID: {username}
        </h1>
        <p className="text-gray-600 mb-6">
          Approve or reject student gatepass requests.
        </p>

        {/* Requests Table */}
        <div className="text-left w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Requests</h2>

          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-gray-500">No requests found.</p>
            ) : (
              requests.map((req) => (
                <motion.div
                  key={req._id}
                  className="p-4 bg-emerald-50 rounded-lg shadow-md flex justify-between items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="font-medium">Student ID: {req.studentId}</p>
                    <p className="text-sm text-gray-600">
                      Purpose: {req.purpose}
                    </p>
                    <p className="text-sm text-gray-600">
                      Destination: {req.destination}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: {req.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      Luggages: {req.luggages}
                    </p>
                  </div>

                  {/* Approve / Reject Buttons */}
                  <div className="flex space-x-3">
                    <button className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Reject
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

export default GuardDashboard;
