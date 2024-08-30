import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { CreateReadingDTO } from './dto/create-reading.dto';
import { UpdateReadingDto } from './dto/update-reading.dto';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post('upload')
  async uploadImage(@Body() body: CreateReadingDTO) {
    return this.readingsService.uploadImage(body);
  }

  @Patch('confirm')
  async confirmReading(@Body() body: UpdateReadingDto) {
    return this.readingsService.confirmReading(body);
  }
  /*

  @Get(':customer_code/list')
  async getReadings(
    @Param('customer_code') customerCode: string,
    @Query('measure_type') measureType?: string,
  ) {
    return this.readingsService.getReadings(customerCode, measureType);
  } */
}
