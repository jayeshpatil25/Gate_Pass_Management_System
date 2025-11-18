import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import studentRoutes from '../routes/student.js';
import guardRoutes from '../routes/guard.js';

import studentConnection from '../db/studentDB.js';
import guardConnection from '../db/guardDB.js';
import gatepassConnection from '../db/gatepassDB.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
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

    app.use('/student', studentRoutes);
    app.use('/guards', guardRoutes);

    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error connecting to databases:', error);
  }
};

startServer();
