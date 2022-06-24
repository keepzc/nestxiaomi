import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const OrderItemSchema = new mongoose.Schema({
  order_id: { type: Schema.Types.ObjectId },
  product_title: { type: String },
  product_id: { type: Schema.Types.ObjectId },
  product_img: { type: String },
  product_price: { type: Number },
  product_num: { type: Number },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
