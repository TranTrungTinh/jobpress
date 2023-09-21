import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsIn, IsString } from 'class-validator';
import { CreateResumeDto } from './create-resume.dto';

const excludedFields = ['jobId', 'companyId'] as const;
export class UpdateResumeDto extends PartialType(
  OmitType(CreateResumeDto, excludedFields),
) {
  @IsString()
  @IsIn(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'] as const)
  status: string;
}
