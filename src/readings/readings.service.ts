import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IntegrationService } from './integration/integration.service';
import { MeasureType } from '@prisma/client';

@Injectable()
export class ReadingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationService: IntegrationService,
  ) {}

  async uploadImage(
    image: string,
    customer_code: string,
    measureDatetime: string,
    measureType: MeasureType,
  ) {
    const customer = await this.prisma.customer.findUnique({
      where: { code: customer_code },
    });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    const existingReading = await this.prisma.reading.findFirst({
      where: {
        customer_code: customer.code,
        measure_type: measureType,
        measure_datetime: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    if (existingReading) {
      // throw new HttpException(
      //   {
      //     error_code: 'DOUBLE_REPORT',
      //     error_description: 'Leitura do mês já realizada',
      //   },
      //   HttpStatus.CONFLICT,
      // );
    }

    const { imageUrl, measureValue } =
      await this.integrationService.processImage(image, measureType);

    const newReading = await this.prisma.reading.create({
      data: {
        measure_datetime: new Date(measureDatetime),
        measure_type: measureType,
        measure_value: Number(measureValue),
        image_url: imageUrl,
        confirmed: false,
        customer: {
          connect: {
            code: customer_code,
          },
        },
      },
    });

    return {
      image_url: newReading.image_url,
      measure_value: newReading.measure_value,
      measure_uuid: newReading.measure_id,
    };
  }
}
