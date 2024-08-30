import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { CreateReadingDTO } from './dto/create-reading.dto';
import { UpdateReadingDTO } from './dto/update-reading.dto';
import { MeasureType } from '@prisma/client';
import { validate } from 'class-validator';
import { GetReadingDTO } from './dto/get-reading.dto';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post('upload')
  async uploadImage(@Body() body: CreateReadingDTO) {
    return this.readingsService.uploadImage(body);
  }

  @Patch('confirm')
  async confirmReading(@Body() body: UpdateReadingDTO) {
    return this.readingsService.confirmReading(body);
  }

  @Get(':customer_code/list')
  async getReadings(
    @Param('customer_code') customerCode: string,
    @Query('measure_type') measureType?: MeasureType,
  ) {
    const data = new GetReadingDTO();
    Object.assign(data, {
      customer_code: customerCode,
      measure_type: measureType?.toUpperCase() as MeasureType,
    });
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new BadRequestException({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }
    return this.readingsService.getReadings(data);
  }
}
