import * as mongoose from 'mongoose';
const d = new Date();
export const UserSchema = new mongoose.Schema({
  password: { type: String },
  phone: { type: Number },
  last_ip: { type: String },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
  email: { type: String },
  status: {
    type: Number,
    default: d.getTime(),
  },
});
