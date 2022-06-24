import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderInterface } from '../../interface/order.interface';
@Injectable()
export class OrderItemService {
  constructor(@InjectModel('OrderItem') private readonly orderItemModel) {}

  async find(json: OrderInterface = {}, fields?: string) {
    try {
      return await this.orderItemModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async count(json: OrderInterface = {}) {
    try {
      return await this.orderItemModel.find(json).count();
    } catch (error) {
      return [];
    }
  }

  async add(json: OrderInterface) {
    try {
      const orderItem = new this.orderItemModel(json);
      const result = await orderItem.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: OrderInterface, json2: OrderInterface) {
    try {
      const result = await this.orderItemModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: OrderInterface) {
    try {
      const result = await this.orderItemModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.orderItemModel;
  }
}
