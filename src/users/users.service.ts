import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './users.schema';
import { CreateUserInput } from './users.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  /**
   * Returns a user by their unique email address or undefined
   *
   * @param {string} email address of user, not case sensitive
   * @returns {(Promise<UserDocument | undefined>)}
   * @memberof UsersService
   */
  async findOneByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    return user;
  }

  async create(values: CreateUserInput): Promise<User> {
    const createdUser = new this.userModel(values);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async deleteAll() {
    const data = await this.userModel.deleteMany({});

    if (data && data.acknowledged) return true;
    return false;
  }
}
