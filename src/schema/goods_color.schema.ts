import * as mongoose from 'mongoose';
export const GoodsColorSchema = new mongoose.Schema({
  color_name: { type: String },
  color_value: { type: String },
  status: { type: Number, default: 1 },
});
