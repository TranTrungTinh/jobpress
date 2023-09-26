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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/global';
import { IUser } from 'src/users/schemas/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create permission successfully')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create({ createRoleDto, user });
  }

  @Get()
  @ResponseMessage('Fetch permissions successfully')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: string,
  ) {
    return this.rolesService.findAll({ currentPage, limit, qs });
  }

  @Get(':id')
  @ResponseMessage('Permission found successfully')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Permission updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return await this.rolesService.update({
      id,
      updateRoleDto,
      user,
    });
  }

  @Delete(':id')
  @ResponseMessage('Permission deleted successfully')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.rolesService.remove({ id, user });
  }
}
