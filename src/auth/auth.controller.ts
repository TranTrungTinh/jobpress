import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/global';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/schemas/users.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('User login')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Req() req, // mean request.user
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, res);
  }

  @ResponseMessage('User logout')
  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(
    @User() user: IUser, // mean request.user
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user, res);
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
