import * as mongoose from 'mongoose';
const d = new Date();
export const UserTempSchema = new mongoose.Schema({
  phone: { type: Number },
  send_count: { type: Number },
  sign: { type: String },
  add_day: {
    type: Number,
  },
  ip: { type: String },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
