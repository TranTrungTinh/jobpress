import { BadGatewayException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/encrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/schemas/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const isValid = await comparePassword(password, user.password);
      if (isValid) return user;
    }
    return null;
  }

  async login(user: IUser, res: Response) {
    const userPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // TODO: Generate refresh token and save to db
    const refreshToken = this.generateRefreshToken(userPayload);
    await this.usersService.updateUserRefreshToken(user._id, refreshToken);

    // TODO: Set refresh token to cookie
    res.cookie('refreshToken', refreshToken);

    return {
      accessToken: this.jwtService.sign(userPayload),
      user: userPayload,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    return await this.usersService.registerByUser(registerUserDto);
  }

  async refreshToken(req, res: Response) {
    // TODO: Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new BadGatewayException('Invalid refresh token');

    // TODO: Verify refresh token
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    if (!decoded) throw new BadGatewayException('Invalid refresh token');

    // TODO: Check refresh token in db
    const user = await this.usersService.findOneByRefreshToken(refreshToken);

    // TODO: Generate new access token
    const userPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // TODO: Sign new refresh and set token to cookie
    const newRefreshToken = this.generateRefreshToken(userPayload);
    res.cookie('refreshToken', newRefreshToken);

    // TODO: Update refresh token in db
    await this.usersService.updateUserRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    // TODO: Return access token
    return {
      accessToken: this.jwtService.sign(userPayload),
      user: userPayload,
    };
  }

  async logout(user: IUser, res: Response) {
    // TODO: Remove refresh token from cookie
    res.clearCookie('refreshToken');

    // TODO: Remove refresh token from db
    await this.usersService.updateUserRefreshToken(user._id, null);

    return 'ok';
  }

  async getMe(user: IUser) {
    return await this.usersService.getProfile(user._id);
  }

  generateRefreshToken(userPayload) {
    return this.jwtService.sign(userPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }
}
