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
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateRegisterUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/global';
import { IUser } from './schemas/users.interface';
import { ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/decorator/global';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('User created successfully')
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.registerByUser(registerUserDto);
  }

  @Get()
  @ResponseMessage('Fetch users with pagination successfully')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: string,
  ) {
    return this.usersService.findAll({ currentPage, limit, qs });
  }

  @Get(':id')
  @ResponseMessage('User found successfully')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('User updated successfully')
  update(@Body() updateUserDto: UpdateRegisterUserDto, @User() user: IUser) {
    return this.usersService.update({
      updateUserDto,
      user,
    });
  }

  @Delete(':id')
  @ResponseMessage('User deleted successfully')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove({ id, user });
  }
}
