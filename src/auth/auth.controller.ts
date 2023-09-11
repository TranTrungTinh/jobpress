import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/global';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/schemas/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage('Register new user')
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('me')
  getProfile(@User() user: IUser) {
    return this.authService.getMe(user);
  }
}
