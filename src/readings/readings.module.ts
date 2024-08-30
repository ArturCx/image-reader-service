import { Module } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ReadingsController } from './readings.controller';
import { IntegrationService } from './integration/integration.service';
import { PrismaModule } from 'prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ReadingsController],
  providers: [ReadingsService, IntegrationService],
  imports: [PrismaModule, HttpModule],
})
export class ReadingsModule {}
