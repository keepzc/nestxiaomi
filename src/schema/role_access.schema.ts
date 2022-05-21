import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const RoleAccessSchema = new mongoose.Schema({
  access_id: { type: Schema.Types.ObjectId },
  role_id: { type: Schema.Types.ObjectId },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
