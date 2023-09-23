import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @IsMongoId()
  jobId: string;
}
