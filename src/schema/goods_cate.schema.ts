import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const GoodsCateSchema = new mongoose.Schema({
  title: { type: String },
  cate_img: { type: String },
  link: {
    type: String,
  },
  template: {
    /*指定当前分类的模板*/ type: String,
  },
  pid: {
    type: Schema.Types.Mixed, //混合类型
  },
  sub_title: { type: String } /*seo相关的标题  关键词  描述*/,
  keywords: { type: String },
  description: { type: String },
  status: { type: Number, default: 1 },
  sort: {
    type: Number,
    default: 100,
  },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
