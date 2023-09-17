import { PickType, PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

const acceptedFields = [
  'name',
  'skill',
  'description',
  'salary',
  'quantity',
  'location',
] as const;

export class UpdateJobDto extends PickType(
  PartialType(CreateJobDto),
  acceptedFields,
) {}
