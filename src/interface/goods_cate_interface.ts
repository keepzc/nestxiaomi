export interface GoodsCateInterface {
  _id?: string;
  title?: string;
  cate_img?: string;
  filter_attr?: string;
  link?: string;
  template?: string;
  pid?: string;
  sub_title?: string /*seo相关的标题  关键词  描述*/;
  keywords?: string;
  description?: string;
  status?: number;
  add_time?: number;
}
