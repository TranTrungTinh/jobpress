import { OmitType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './create-user.dto';

const excludedFields = ['password', 'email'] as const;
export class UpdateRegisterUserDto extends OmitType(
  RegisterUserDto,
  excludedFields,
) {
  _id: string;
}
