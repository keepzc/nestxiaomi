import * as mongoose from 'mongoose';
const d = new Date();
export const FocusSchema = new mongoose.Schema({
  title: { type: String },
  type: { type: Number },
  focus_img: { type: String },
  link: { type: String },
  sort: { type: Number },
  status: { type: Number, default: 1 },
  add_time: {
    type: Number,
    default: d.getTime()
  }
});
