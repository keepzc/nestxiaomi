/*
1、模块名称: 模块名称就是左侧的主菜单名称，如果增加数据的时候是模块，那么需要指定节点类型是模块，并且选择所属模块为顶级模块


2、节点类型： 1、表示模块   2、表示菜单     3、操作


3、操作名称:如果节点类型是菜单，那么操作名称就是左侧菜单的名称。如果节点类型是操作，那么操作名称就是具体的操作名称


4、操作地址：用户实际访问的地址


5、所属模块：模块（顶级模块）  菜单和操作（父亲模块）


*/

import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();

export const AccessSchema = new mongoose.Schema({
  module_name: { type: String }, //模块名称
  action_name: { type: String }, //操作名称
  type: { type: Number }, //节点类型 :  1、表示模块   2、表示菜单     3、操作
  url: { type: String }, //路由跳转地址
  module_id: {
    //此module_id和当前模型的_id关联     module_id= 0 表示模块
    type: Schema.Types.Mixed, //混合类型    注意
  },
  sort: {
    type: Number,
    default: 100,
  },
  description: { type: String },
  status: {
    type: Number,
    default: 1,
  },
  add_time: {
    type: Number,
    default: d.getTime(),
  },
});
