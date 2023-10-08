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
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/schemas/users.interface';
import { Response } from 'express';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({ type: UserLoginDto })
  @ResponseMessage('User login')
  @UseGuards(LocalAuthGuard)

  // @UseGuards(ThrottlerGuard) // TODO: Enable throttler
  // @Throttle({ default: { limit: 3, ttl: 60000 } }) // TODO: Enable throttler
  // @SkipThrottle({ default: false }) // TODO: Rate limiting is applied to this route.
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

  @Public()
  @ResponseMessage('Refresh token for user')
  @Post('refresh-token')
  refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(req, res);
  }

  @Get('account')
  @ResponseMessage('Get profile of user')
  getProfile(@User() user: IUser) {
    return this.authService.getMe(user);
  }
}
