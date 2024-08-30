import { MeasureType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class GetReadingDTO {
  @IsNotEmpty()
  customer_code: string;

  @IsEnum(MeasureType)
  @IsOptional()
  measure_type?: MeasureType;
}
