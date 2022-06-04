import * as mongoose from 'mongoose';
const d = new Date();
export const NavSchema = new mongoose.Schema({
  title: { type: String },
  link: { type: String },
  position: {
    type: Number,
    default: 2, //1 最顶部     2 中间   3 底部
  },
  is_opennew: {
    type: Number,
    default: 1, //1、本窗口    2、新窗口
  },
  sort: {
    type: Number,
    default: 100,
  },
  relation: {
    //  1,2,3
    type: String,
    default: '',
  },
  status: { type: Number, default: 1 },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
