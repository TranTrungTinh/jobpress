import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId, toObjectId, toObjectUser } from 'src/utils/string';
import { omit } from 'lodash';
import { IUser } from 'src/users/schemas/users.interface';
import aps from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(args: {
    createPermissionDto: CreatePermissionDto;
    user: IUser;
  }) {
    const { apiPath, method } = args.createPermissionDto;

    // TODO: Check apiPath and method is exist in db
    const permissionInfo = await this.permissionModel.findOne({
      $and: [{ apiPath }, { method }],
    });

    if (permissionInfo) throw new BadRequestException('Permission is exist');

    // TODO: Create new resume
    const dataInfo = await this.permissionModel.create({
      ...args.createPermissionDto,
      createdBy: toObjectUser(args.user),
    });

    return omit(dataInfo.toJSON(), ['__v', 'deletedAt', 'deletedBy']);
  }

  async findAll(args: { currentPage: string; limit: string; qs: string }) {
    const { currentPage = 1, limit = 10, qs } = args;
    const { filter, sort } = aps(qs);

    delete filter.current;
    delete filter.pageSize;

    const [totalItems, results] = await Promise.all([
      this.permissionModel.find(filter).countDocuments(),
      this.permissionModel
        .find(filter)
        .skip((+currentPage - 1) * +limit)
        .limit(+limit)
        .sort(sort)
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
    if (!isValidObjectId(id))
      throw new BadRequestException('Permission not found');

    const dataInfo = await this.permissionModel
      .findOne({
        $and: [{ _id: toObjectId(id) }, { isDeleted: false }],
      })
      .lean();
    return omit(dataInfo, ['__v', 'deletedAt', 'deletedBy']);
  }

  async update(args: {
    id: string;
    updatePermissionDto: UpdatePermissionDto;
    user: IUser;
  }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('Permission not found');

    const dataInfo = await this.permissionModel
      .updateOne(
        {
          _id: toObjectId(args.id),
        },
        {
          $set: {
            ...args.updatePermissionDto,
            updatedBy: toObjectUser(args.user),
          },
        },
      )
      .lean();

    return omit(dataInfo, ['__v', 'deletedAt', 'deletedBy']);
  }

  async remove(args: { id: string; user: IUser }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('resume not found');

    const [, result] = await Promise.all([
      this.permissionModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          $set: {
            deletedBy: toObjectUser(args.user),
          },
        },
      ),
      this.permissionModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }
}
