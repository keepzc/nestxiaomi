import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FocusInterface } from '../../interface/focus.interface';
@Injectable()
export class FocusService {
  constructor(@InjectModel('Focus') private readonly focusModel) {}
  async find(json: FocusInterface, fields?: string) {
    try {
      return await this.focusModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }
  async add(json: FocusInterface) {
    try {
      const focus = new this.focusModel(json);
      const result = await focus.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: FocusInterface, json2: FocusInterface) {
    try {
      const result = await this.focusModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
  async delete(json: FocusInterface) {
    try {
      const result = await this.focusModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  getModel() {
    return this.focusModel;
  }
}
