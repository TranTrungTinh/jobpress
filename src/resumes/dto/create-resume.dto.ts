import { IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  jobId: string;
}
