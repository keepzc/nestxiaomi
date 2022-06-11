import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  cartHasdata(cartList, currentData) {
    if (cartList.length > 0) {
      for (let i = 0; i < cartList.length; i++) {
        if (
          cartList[i]._id.toString() == currentData._id.toString() &&
          cartList[i].color == currentData.color &&
          cartList[i].goods_attr == currentData.goods_attr
        ) {
          return true;
        }
      }
    } else {
      return false;
    }
  }
}
