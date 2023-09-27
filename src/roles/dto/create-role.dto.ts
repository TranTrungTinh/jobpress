import {
  IsArray,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { userRoleList } from 'src/constants/enums';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(userRoleList)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'DELETE'] as const)
  method: string;

  @IsNotEmpty()
  @IsArray()
  // TODO: each true means that every element in the array must be a string
  @IsMongoId({ each: true })
  permissions: string[];
}
