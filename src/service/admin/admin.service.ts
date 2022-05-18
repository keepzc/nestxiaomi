import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AdminService {
  constructor(@InjectModel('Admin') private readonly adminModel) {}

  async find(json = {}) {
    return await this.adminModel.find(json).exec();
  }
}
