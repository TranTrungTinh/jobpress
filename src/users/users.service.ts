import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { hashPassword } from '../utils/encrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>, // private readonly usersService: UsersService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    return await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    });
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  async findOne(id: string) {
    // TODO: Check mongoose object id
    if (!Types.ObjectId.isValid(id)) throw new Error('User not found');
    return await this.userModel.findById(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(updateUserDto._id))
      throw new Error('User not found');

    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error('User not found');
    return await this.userModel.softDelete({
      _id: id,
    });
  }
}
