import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateRegisterUserDto } from './dto/update-user.dto';
import { User } from 'src/decorator/global';
import { IUser } from './schemas/users.interface';
// import { Public } from 'src/decorator/global';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.registerByUser(registerUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateRegisterUserDto, @User() user: IUser) {
    return this.usersService.update({
      updateUserDto,
      user,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove({ id, user });
  }
}
