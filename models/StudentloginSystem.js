import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


export default function getStudentModel(connection) {
  return connection.model('Student', studentSchema);
}
