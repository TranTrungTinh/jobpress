import { IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  logo: string;
}
