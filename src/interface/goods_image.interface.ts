import mongoose from 'mongoose';
export interface GoodsImageInterface {
  _id?: string;
  goods_id?: mongoose.Types.ObjectId;
  img_url?: string;
  color_id?: mongoose.Types.ObjectId;
  status?: number;
  sort?: number;
  add_time?: number;
}
