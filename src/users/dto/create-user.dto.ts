import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { mongo } from 'mongoose';
import { Type } from 'class-transformer';
import { Gender, genderList } from 'src/constants/enums';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  age: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(genderList)
  gender: Gender | null;

  address: string;
}

class Company {
  name: string;
  _id: mongo.ObjectId;
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  age: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  @IsMongoId()
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  address: string;
}


export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'tinh2t', description: 'Email' })
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: 'Password' })
  password: string;
}