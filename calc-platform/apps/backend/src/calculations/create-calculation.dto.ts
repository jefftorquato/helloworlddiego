import { CreateCalculationInput } from '@calc/shared';
import { IsString } from 'class-validator';

export class CreateCalculationDto implements CreateCalculationInput {
  @IsString()
  expression!: string;

  @IsString()
  result!: string;
}
