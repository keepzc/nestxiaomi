import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Addressinterface } from '../../interface/address.interface';

@Injectable()
export class AddressService {
  constructor(@InjectModel('Address') private readonly addressModel) {}

  async find(json: Addressinterface = {}, sortJson = {}, fields?: string) {
    try {
      return await this.addressModel.find(json, fields).sort(sortJson);
    } catch (error) {
      return [];
    }
  }
  async count(json: Addressinterface = {}) {
    try {
      return await this.addressModel.find(json).count();
    } catch (error) {
      return [];
    }
  }
  async add(json: Addressinterface) {
    try {
      const address = new this.addressModel(json);
      const result = await address.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: Addressinterface, json2: Addressinterface) {
    try {
      const result = await this.addressModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async updateMany(json1: Addressinterface, json2: Addressinterface) {
    try {
      const result = await this.addressModel.updateMany(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: Addressinterface) {
    try {
      const result = await this.addressModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.addressModel;
  }
}
