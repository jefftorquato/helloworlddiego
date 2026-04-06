import { Module } from '@nestjs/common';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CalculationsController],
  providers: [CalculationsService, PrismaService],
})
export class CalculationsModule {}
