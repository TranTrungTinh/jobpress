import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateRegisterUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hashPassword } from '../utils/encrypt';
import { pick, omit } from 'lodash';
import { IUser } from './schemas/users.interface';
import { toObjectId } from 'src/utils/string';
import { AppConfig } from 'src/constants/enums';
import aps from 'api-query-params';
import { getSelectFields, getUnSelectFields } from 'src/utils/object';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>, // private readonly usersService: UsersService,
  ) {}

  async registerByUser(registerUserDto: RegisterUserDto) {
    const hashedPassword = await hashPassword(registerUserDto.password);

    // TODO: Check if email already exists
    const user = await this.userModel.findOne({ email: registerUserDto.email });
    if (user) throw new BadRequestException('Email already exists');

    const createdUserInfo = await this.userModel.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: hashedPassword,
      age: registerUserDto.age,
      address: registerUserDto.address,
      gender: registerUserDto.gender,
    });

    return pick(createdUserInfo, ['_id', 'name']);
  }

  async findAll(args: { currentPage: string; limit: string; qs: string }) {
    const { currentPage = 1, limit = 10, qs } = args;
    const { filter, sort, population } = aps(qs);

    delete filter.current;
    delete filter.pageSize;

    const [totalItems, results] = await Promise.all([
      this.userModel.find(filter).countDocuments(),
      this.userModel
        .find(filter)
        .skip((+currentPage - 1) * +limit)
        .limit(+limit)
        .sort(sort)
        .populate(population)
        .select(getUnSelectFields(['password']))
        .exec(),
    ]);

    return {
      meta: {
        current: currentPage, // this mean current page
        pageSize: limit, // this mean limit per page
        pages: Math.ceil(totalItems / +limit), // this mean total pages
        total: totalItems, // this mean total items
      },
      results, // this mean data
    };
  }

  async findOne(id: string) {
    // TODO: Check mongoose object id
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('User not found');
    return await this.userModel
      .findOne({ _id: id })
      .populate({
        path: 'role',
        select: getSelectFields(['name', 'permissions']),
      })
      .lean();
  }

  async findOneByEmail(email: string) {
    // TODO: Check mongoose object id
    return await this.userModel
      .findOne({ email })
      .populate({
        path: 'role',
        select: getSelectFields(['name', 'permissions']),
      })
      .lean();
  }

  async update(args: { updateUserDto: UpdateRegisterUserDto; user: IUser }) {
    if (!Types.ObjectId.isValid(args.updateUserDto._id))
      throw new BadRequestException('User not found');

    return await this.userModel
      .updateOne(
        {
          _id: toObjectId(args.updateUserDto._id),
        },
        {
          ...args.updateUserDto,
          updatedBy: {
            _id: toObjectId(args.user._id),
            email: args.user.email,
          },
        },
      )
      .lean();
  }

  async getProfile(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('User not found');

    const userInfo = await this.userModel
      .findOne({
        _id: toObjectId(id),
        isDeleted: false,
      })
      .populate({
        path: 'role',
        select: getSelectFields(['name', 'permissions']),
      })
      .lean();

    // if (!userInfo) throw new NotFoundException('User not found');

    return omit(userInfo, ['__v', 'password', 'deletedAt', 'isDeleted']);
  }

  async remove(args: { id: string; user: IUser }) {
    if (!Types.ObjectId.isValid(args.id))
      throw new BadRequestException('User not found');

    // TODO: find user with role is admin
    const foundUser = await this.userModel.findById(args.id).lean();
    if (foundUser.email === AppConfig.ADMIN_EMAIL) {
      throw new BadRequestException('Cannot delete this user');
    }

    const [, result] = await Promise.all([
      this.userModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          deletedBy: {
            _id: toObjectId(args.user._id),
            email: args.user.email,
          },
        },
      ),
      this.userModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }

  async updateUserRefreshToken(id: string, refreshToken: string) {
    return await this.userModel.updateOne(
      { _id: toObjectId(id) },
      { refreshToken },
    );
  }

  async findOneByRefreshToken(refreshToken: string) {
    return await this.userModel
      .findOne({ refreshToken })
      .populate({
        path: 'role',
        select: getSelectFields(['name', 'permissions']),
      })
      .lean();
  }
}
