import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateReadingDto {
  @IsNotEmpty()
  @IsUUID()
  measure_id: string;

  @IsNotEmpty()
  @IsNumber()
  measure_value: number;
}
