// AT THE VERY TOP - This loads .env variables before anything else
import 'dotenv/config';

// All other imports go AFTER
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import studentRoutes from '../routes/student.js';
import guardRoutes from '../routes/guard.js';

import studentConnection from '../db/studentDB.js';
import guardConnection from '../db/guardDB.js';
import gatepassConnection from '../db/gatepassDB.js';
import getDatabaseModel from '../models/Gatepass.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Wait for all database connections (use 'connected' event to match DB modules)
    await Promise.all([
      new Promise((resolve, reject) => {
        studentConnection.once('connected', resolve);
        studentConnection.on('error', reject);
      }),
      new Promise((resolve, reject) => {
        guardConnection.once('connected', resolve);
        guardConnection.on('error', reject);
      }),
      new Promise((resolve, reject) => {
        gatepassConnection.once('connected', resolve);
        gatepassConnection.on('error', reject);
      }),
    ]);

    console.log('✅ All databases connected successfully.');

    // Mount routes
    app.use('/student', studentRoutes);
    app.use('/guards', guardRoutes);

    // Gatepass model and approval route
    const GatePass = getDatabaseModel(gatepassConnection);

    app.patch('/requests/:id', async (req, res) => {
      try {
        const updated = await GatePass.findByIdAndUpdate(req.params.id, { status: 'Approved' });
        res.status(200).json({ message: 'Request approved' });
      } catch (err) {
        console.error("Error updating request:", err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Catch-all 404
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error connecting to databases:', error);
  }
};

startServer();