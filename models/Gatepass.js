import mongoose from 'mongoose';

const gatepassdataSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  hostelBlock: { type: String, required: true },
  name: { type: String, required: true },

  date: { 
    type: Date, 
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // remove time portion
        return value >= today;
      },
      message: "Date must be today or later"
    }
  },

  time: { type: String, required: true },
  luggages: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  purpose: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create model factory function
export default function getDatabaseModel(connection) {
  return connection.model('GatePassData', gatepassdataSchema);
}
