import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import getGuardModel from '../models/GuardloginSystem.js';
import guardConnection from '../db/guardDB.js';
import getDatabaseModel from '../models/Gatepass.js';
import databaseConnection from '../db/gatepassDB.js';
import { authenticateJWT } from '../middleware/auth.js';

const Guard = getGuardModel(guardConnection);
const GatePass = getDatabaseModel(databaseConnection);

const router = express.Router();


router.post('/register', async (req, res) => {
  const { guardId, password } = req.body;

  try {
    const existingGuard = await Guard.findOne({ guardId });
    if (existingGuard)
      return res.status(400).json({ error: 'Guard already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new Guard({ guardId, password: hashedPassword }).save();

    res.status(201).json({ message: 'Guard registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
  const { guardId, password } = req.body;

  try {
    const guard = await Guard.findOne({ guardId });
    if (!guard) return res.status(404).json({ error: 'Guard not found' });

    const valid = await bcrypt.compare(password, guard.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { guardId: guard.guardId, role: 'guard' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, guardId: guard.guardId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.use(authenticateJWT);


router.get('/requests', async (req, res) => {
  if (req.user.role !== 'guard')
    return res.status(403).json({ error: 'Forbidden' });

  try {
    const requests = await GatePass.find({ status: 'Pending' }).sort({ date: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/approve/:id', async (req, res) => {
  try {
    const updated = await GatePass.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Request not found' });

    res.json({ message: 'Request approved', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/reject/:id', async (req, res) => {
  try {
    const updated = await GatePass.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Request not found' });

    res.json({ message: 'Request rejected', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
