import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/users.interface';
import { isValidObjectId, toObjectId, toObjectUser } from 'src/utils/string';
import { omit } from 'lodash';
import aps from 'api-query-params';
import { getSelectFields, getUnSelectFields } from 'src/utils/object';
import { UserRole } from 'src/constants/enums';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(args: { createRoleDto: CreateRoleDto; user: IUser }) {
    const { name, permissions } = args.createRoleDto;

    // TODO: Check permissions ids is mongoose id
    const isValidPermissions = permissions.every((item) =>
      isValidObjectId(item),
    );
    if (!isValidPermissions)
      throw new BadRequestException('Invalid permissions');

    // TODO: Check name is exist in db
    const existedData = await this.roleModel.findOne({
      $and: [{ name }],
    });

    if (existedData) throw new BadRequestException('Group is exist');

    // TODO: Create new resume
    const dataInfo = await this.roleModel.create({
      ...args.createRoleDto,
      isActive: true,
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
      this.roleModel.find(filter).countDocuments(),
      this.roleModel
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
    if (!isValidObjectId(id)) throw new BadRequestException('Role not found');

    return await this.roleModel
      .findOne({
        $and: [{ _id: toObjectId(id) }, { isDeleted: false }],
      })
      .populate({
        path: 'permissions',
        select: getSelectFields(['_id', 'name', 'apiPath', 'method', 'module']),
      })
      .select(getUnSelectFields(['__v', 'deletedAt', 'deletedBy']))
      .lean();
  }

  async update(args: {
    id: string;
    updateRoleDto: UpdateRoleDto;
    user: IUser;
  }) {
    const { permissions } = args.updateRoleDto;

    if (!isValidObjectId(args.id))
      throw new BadRequestException('Role not found');

    const isValidPermissions = permissions.every((item) =>
      isValidObjectId(item),
    );

    if (!isValidPermissions)
      throw new BadRequestException('Invalid permissions');

    // TODO: Check name is exist in db
    // const existedData = await this.roleModel.findOne({
    //   $and: [{ name }, { _id: { $ne: toObjectId(args.id) } }],
    // });

    // if (existedData) throw new BadRequestException('Group is exist');

    const dataInfo = await this.roleModel
      .updateOne(
        {
          _id: toObjectId(args.id),
        },
        {
          $set: {
            ...args.updateRoleDto,
            updatedBy: toObjectUser(args.user),
          },
        },
      )
      .lean();

    return omit(dataInfo, ['__v', 'deletedAt', 'deletedBy']);
  }

  async remove(args: { id: string; user: IUser }) {
    if (!isValidObjectId(args.id))
      throw new BadRequestException('Role not found');

    const foundRole = await this.roleModel.findById(args.id).lean();
    if (foundRole?.name === UserRole.superAdmin) {
      throw new BadRequestException('Can not delete admin role');
    }

    const [, result] = await Promise.all([
      this.roleModel.updateOne(
        { _id: toObjectId(args.id) },
        {
          $set: {
            deletedBy: toObjectUser(args.user),
          },
        },
      ),
      this.roleModel.softDelete({ _id: toObjectId(args.id) }),
    ]);

    return result;
  }
}
