import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/global';
import { IUser } from 'src/users/schemas/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Create permission successfully')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.create({ createPermissionDto, user });
  }

  @Get()
  @ResponseMessage('Fetch permissions successfully')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: string,
  ) {
    return this.permissionsService.findAll({ currentPage, limit, qs });
  }

  @Get(':id')
  @ResponseMessage('Permission found successfully')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Permission updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return await this.permissionsService.update({
      id,
      updatePermissionDto,
      user,
    });
  }

  @Delete(':id')
  @ResponseMessage('Permission deleted successfully')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.permissionsService.remove({ id, user });
  }
}
