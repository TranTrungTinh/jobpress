import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/global';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/me')
  getProfile(@Request() req) {
    return req.user;
  }
}
