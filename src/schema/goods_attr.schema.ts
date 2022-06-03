import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const GoodsAttrSchema = new mongoose.Schema({
  goods_id: { type: Schema.Types.ObjectId },
  //备用字段 开始
  goods_cate_id: {
    type: Schema.Types.ObjectId,
  },
  attribute_cate_id: {
    type: Schema.Types.ObjectId,
  },
  attribute_id: {
    type: Schema.Types.ObjectId,
  },
  attribute_type: {
    type: String,
  },
  //备用字段 结束

  attribute_title: {
    type: String,
  },
  attribute_value: {
    type: String,
  },
  status: { type: Number, default: 1 },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
