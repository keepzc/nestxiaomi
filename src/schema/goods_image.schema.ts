import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const GoodsImageSchema = new mongoose.Schema({
  goods_id: { type: Schema.Types.ObjectId },
  img_url: { type: String },
  color_id: {
    type: Schema.Types.Mixed, // 混合类型
    default: '',
  },
  sort: { type: Number, default: 100 },
  status: { type: Number, default: 1 },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
