import { Module } from '@nestjs/common';
import { CalculationsModule } from './calculations/calculations.module';

@Module({
  imports: [CalculationsModule],
})
export class AppModule {}
