import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

const excludedFields = ['password', 'email'] as const;
export class UpdateUserDto extends OmitType(CreateUserDto, excludedFields) {
  _id: string;
}
