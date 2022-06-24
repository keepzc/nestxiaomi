import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const OrderSchema = new mongoose.Schema({
  uid: { type: Schema.Types.ObjectId },
  all_price: { type: Number },
  order_id: { type: Number }, //订单号  随机生成的订单号
  name: { type: String },
  phone: { type: Number },
  address: { type: String },
  zipcode: { type: String },
  pay_status: { type: Number }, // 支付状态： 0 表示未支付     1 已经支付
  pay_type: { type: String }, // 支付类型： alipay    wechat
  order_status: {
    // 订单状态： 0 已下单  1 已付款  2 已配货  3、发货   4、交易成功   5、退货     6、取消
    type: Number,
  },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
