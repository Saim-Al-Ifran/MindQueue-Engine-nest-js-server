import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  getAll() {
    return this.userModel.find({ isActive: true }).select('-passwordHash');
  }

  getById(id: string) {
    return this.userModel.findById(id).select('-passwordHash');
  }

  async create(body: any) {
    body.passwordHash = await bcrypt.hash(body.password, 10);
    return this.userModel.create(body);
  }

  update(id: string, body: any) {
    return this.userModel.findByIdAndUpdate(id, body, { new: true });
  }

  softDelete(id: string) {
    return this.userModel.findByIdAndUpdate(id, { isActive: false });
  }

  async changePassword(userId: string, body: any) {
    const passwordHash = await bcrypt.hash(body.newPassword, 10);
    return this.userModel.findByIdAndUpdate(userId, { passwordHash });
  }
}
