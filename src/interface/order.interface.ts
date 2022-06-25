export interface OrderInterface {
  _id?: string;
  uid?: any;
  all_price?: number;
  order_id?: string;
  name?: string;
  phone?: number;
  address?: string;
  zipcode?: string;
  pay_status?: number; // 支付状态： 0 表示未支付     1 已经支付
  pay_type?: string; // 支付类型： alipay    wechat
  order_status?: number;
  add_time?: number;
}
