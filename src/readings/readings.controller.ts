import { Controller, Post, Body } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post('upload')
  async uploadImage(@Body() body: any) {
    const { image, customer_code, measure_datetime, measure_type } = body;
    return this.readingsService.uploadImage(
      image,
      customer_code,
      measure_datetime,
      measure_type,
    );
  }

  /* @Patch('confirm')
  async confirmReading(@Body() body: any) {
    const { measure_uuid, confirmed_value } = body;
    return this.readingsService.confirmReading(measure_uuid, confirmed_value);
  }

  @Get(':customer_code/list')
  async getReadings(
    @Param('customer_code') customerCode: string,
    @Query('measure_type') measureType?: string,
  ) {
    return this.readingsService.getReadings(customerCode, measureType);
  } */
}
