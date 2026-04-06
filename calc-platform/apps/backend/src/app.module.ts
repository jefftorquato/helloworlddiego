import { Module } from '@nestjs/common';
import { CalculationsModule } from './calculations/calculations.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CalculationsModule],
})
export class AppModule {}
