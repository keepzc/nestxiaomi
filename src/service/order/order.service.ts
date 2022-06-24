import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderInterface } from '../../interface/order.interface';
@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private readonly orderModel) {}

  async find(json: OrderInterface = {}, fields?: string) {
    try {
      return await this.orderModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async count(json: OrderInterface = {}) {
    try {
      return await this.orderModel.find(json).count();
    } catch (error) {
      return [];
    }
  }

  async add(json: OrderInterface) {
    try {
      const order = new this.orderModel(json);
      const result = await order.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: OrderInterface, json2: OrderInterface) {
    try {
      const result = await this.orderModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: OrderInterface) {
    try {
      const result = await this.orderModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.orderModel;
  }
}
