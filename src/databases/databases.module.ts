import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/schema/permission.schema';
import { User } from 'src/decorator/global';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
})
export class DatabasesModule {}
