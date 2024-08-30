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
