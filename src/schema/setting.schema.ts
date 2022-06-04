import * as mongoose from 'mongoose';
const d = new Date();
export const SettingSchema = new mongoose.Schema({
  site_title: { type: String },
  site_logo: { type: String },
  site_keywords: {
    type: String,
  },
  site_description: {
    type: String,
  },
  no_picture: {
    type: String,
  },
  site_icp: {
    type: String,
  },
  site_tel: {
    type: String,
  },
  search_keywords: {
    type: String,
  },
  tongji_code: {
    type: String,
  },
});

//后期有新增的字段还需要接口里面配置
