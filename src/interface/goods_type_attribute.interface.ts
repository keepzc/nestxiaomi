export interface GoodsTypeAttributeInterface {
  _id?:String;
  cate_id?:String;
  title?: String;
  attr_type?: String;      //类型  1 input    2  textarea    3、select
  attr_value?:String;      //默认值： input  textarea默认值是空     select框有默认值  多个默认值以回车隔开
  status?: Number;   
  add_time?: Number;  
}