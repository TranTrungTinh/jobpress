import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/global';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schema/permission.schema';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './db/init';
import { hashPasswordSync } from 'src/utils/encrypt';
import { EGender } from 'src/constants/enums';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT_DATA');
    Boolean(isInit) && this.initData();
  }

  async initData() {
    const [countUser, countPermission, countRole] = await Promise.all([
      this.userModel.count({}),
      this.permissionModel.count({}),
      this.roleModel.count({}),
    ]);

    //create permissions
    if (countPermission === 0) {
      await this.permissionModel.insertMany(INIT_PERMISSIONS);
      //bulk create
    }

    // create role
    if (countRole === 0) {
      const permissions = await this.permissionModel.find({}).select('_id');
      await this.roleModel.insertMany([
        {
          name: ADMIN_ROLE,
          description: 'Admin thì full quyền :v',
          isActive: true,
          permissions: permissions,
        },
        {
          name: USER_ROLE,
          description: 'Người dùng/Ứng viên sử dụng hệ thống',
          isActive: true,
          permissions: [], //không set quyền, chỉ cần add ROLE
        },
      ]);
    }

    if (countUser === 0) {
      const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
      const userRole = await this.roleModel.findOne({ name: USER_ROLE });
      const defaultPassword = this.configService.get<string>('INIT_PASSWORD');
      await this.userModel.insertMany([
        {
          name: "I'm admin",
          email: 'tinhadmin@gmail.com',
          password: hashPasswordSync(defaultPassword),
          age: 17,
          gender: EGender.male,
          address: 'VietNam',
          role: adminRole?._id,
        },
        {
          name: "I'm Tran Trung Tinh",
          email: 'tinh2t@gmail.com',
          password: hashPasswordSync(defaultPassword),
          age: 26,
          gender: EGender.male,
          address: 'VietNam',
          role: adminRole?._id,
        },
        {
          name: "I'm normal user",
          email: 'tinhuser@gmail.com',
          password: hashPasswordSync(defaultPassword),
          age: 14,
          gender: EGender.male,
          address: 'VietNam',
          role: userRole?._id,
        },
      ]);
    }

    if (countUser > 0 && countRole > 0 && countPermission > 0) {
      this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
    }
  }
}
