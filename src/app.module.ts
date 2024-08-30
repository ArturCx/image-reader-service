import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReadingsModule } from './readings/readings.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ReadingsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.docker'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
