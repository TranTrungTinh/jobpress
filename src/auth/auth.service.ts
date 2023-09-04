import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/encrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const isValid = await comparePassword(password, user.password);
      if (isValid) return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, userId: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
