import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [PrismaModule, ReadingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
