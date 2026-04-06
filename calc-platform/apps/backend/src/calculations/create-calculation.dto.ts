import { IsString } from 'class-validator';

export class CreateCalculationDto {
  @IsString()
  expression!: string;

  @IsString()
  result!: string;
}
