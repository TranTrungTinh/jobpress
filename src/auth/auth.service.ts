import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/encrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser, IUserToken } from 'src/users/schemas/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const isValid = await comparePassword(password, user.password);
      if (isValid) return user;
    }
    return null;
  }

  async login(user: IUser): Promise<IUserToken> {
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(userPayload),
      ...userPayload,
    };
  }
}
