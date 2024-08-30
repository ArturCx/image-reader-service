/*import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { IntegrationService } from './integration.service';

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
    measureType: string,
  ) {
    const customer = await this.prisma.customer.findUnique({
      where: { customer_code },
    });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    const existingReading = await this.prisma.reading.findFirst({
      where: {
        customer_id: customer.id,
        measure_type: measureType.toUpperCase(),
        measure_datetime: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    if (existingReading) {
      throw new HttpException(
        {
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada',
        },
        HttpStatus.CONFLICT,
      );
    }

    const { imageUrl, measureValue } =
      await this.integrationService.processImage(image);

    const measure_id = uuidv4();

    const newReading = await this.prisma.reading.create({
      data: {
        measure_id,
        customer_id: customer.id,
        measure_datetime: new Date(measureDatetime),
        measure_type: measureType.toUpperCase(),
        measure_value,
        imageUrl,
        confirmed: false,
      },
    });

    return {
      image_url: newReading.imageUrl,
      measure_value: newReading.measureValue,
      measure_uuid: newReading.measureUuid,
    };
  }

  async confirmReading(measureUuid: string, confirmedValue: number) {
    const reading = await this.prisma.reading.findUnique({
      where: { measureUuid },
    });

    if (!reading) {
      throw new HttpException(
        {
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Leitura não encontrada',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (reading.confirmed) {
      throw new HttpException(
        {
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura já confirmada',
        },
        HttpStatus.CONFLICT,
      );
    }

    const updatedReading = await this.prisma.reading.update({
      where: { measureUuid },
      data: {
        confirmedValue,
        confirmed: true,
      },
    });

    return { success: true };
  }

  async getReadings(customerCode: string, measureType?: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { customerCode },
      include: {
        readings: measureType
          ? {
              where: { measureType: measureType.toUpperCase() },
            }
          : true,
      },
    });

    if (!customer || customer.readings.length === 0) {
      throw new HttpException(
        {
          error_code: 'MEASURES_NOT_FOUND',
          error_description: 'Nenhuma leitura encontrada',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      customer_code: customer.customerCode,
      measures: customer.readings.map((reading) => ({
        measure_uuid: reading.measureUuid,
        measure_datetime: reading.measureDatetime,
        measure_type: reading.measureType,
        has_confirmed: reading.confirmed,
        image_url: reading.imageUrl,
      })),
    };
  }
} */
