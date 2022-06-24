import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const AddressSchema = new mongoose.Schema({
  uid: { type: Schema.Types.ObjectId },
  name: { type: String },
  phone: { type: Number },
  address: { type: String },
  zipcode: { type: String },
  default_address: { type: Number, default: 1 },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
