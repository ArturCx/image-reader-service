import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IntegrationService } from './integration/integration.service';
import { CreateReadingDTO } from './dto/create-reading.dto';
import { UpdateReadingDTO } from './dto/update-reading.dto';
import { GetReadingDTO } from './dto/get-reading.dto';

@Injectable()
export class ReadingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationService: IntegrationService,
  ) {}

  async uploadImage(data: CreateReadingDTO) {
    const firstOfTheMonth = new Date(data.measure_datetime);
    firstOfTheMonth.setDate(1);
    const lastOfTheMonth = new Date(data.measure_datetime);
    lastOfTheMonth.setMonth(lastOfTheMonth.getMonth() + 1);
    lastOfTheMonth.setDate(0);

    const existingReading = await this.prisma.reading.findFirst({
      where: {
        customer_code: data.customer_code,
        measure_type: data.measure_type,
        measure_datetime: {
          gte: firstOfTheMonth,
          lte: lastOfTheMonth,
        },
      },
    });

    if (existingReading) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const { imageUrl, measureValue } =
      await this.integrationService.processImage(data.image, data.measure_type);

    const newReading = await this.prisma.reading.create({
      data: {
        measure_datetime: data.measure_datetime,
        measure_type: data.measure_type,
        measure_value: Number(measureValue),
        image_url: imageUrl,
        confirmed: false,
        customer: {
          /**
           * Por não ter sido especificado nos requisitos se o customer
           * deveria já existir e por não haver endpoint de CRUD de customers,
           * será criado um novo customer caso não exista ainda.
           */
          connectOrCreate: {
            where: {
              code: data.customer_code,
            },
            create: {
              code: data.customer_code,
            },
          },
        },
      },
    });

    return {
      image_url: newReading.image_url,
      measure_value: newReading.measure_value,
      measure_uuid: newReading.id,
    };
  }

  async confirmReading(data: UpdateReadingDTO) {
    const reading = await this.prisma.reading.findUnique({
      where: { id: data.measure_id },
    });

    if (!reading) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });
    }

    if (reading.confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada',
      });
    }

    await this.prisma.reading.update({
      where: { id: data.measure_id },
      data: {
        measure_value: data.measure_value,
        confirmed: true,
      },
    });

    return { success: true };
  }

  async getReadings(data: GetReadingDTO) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        code: data.customer_code,
      },
      include: {
        readings: {
          where: {
            measure_type: data.measure_type,
          },
        },
      },
    });

    if (!customer || customer.readings.length === 0) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    return {
      customer_code: customer.code,
      measures: customer.readings.map((reading) => ({
        measure_uuid: reading.id,
        measure_datetime: reading.measure_datetime,
        measure_type: reading.measure_type,
        has_confirmed: reading.confirmed,
        image_url: reading.image_url,
      })),
    };
  }
}
