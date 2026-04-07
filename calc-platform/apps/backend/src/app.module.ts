import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalculationsModule } from './calculations/calculations.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    CalculationsModule,
  ],
})
export class AppModule {}
