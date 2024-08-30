import { MeasureType } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateReadingDTO {
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  customer_code: string;

  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  measure_datetime: Date;

  @IsNotEmpty()
  @IsEnum(MeasureType)
  measure_type: MeasureType;
}
