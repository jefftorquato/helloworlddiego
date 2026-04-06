import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCalculationDto } from './create-calculation.dto';
import { CalculationsService } from './calculations.service';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  create(@Body() createCalculationDto: CreateCalculationDto) {
    return this.calculationsService.create(createCalculationDto);
  }

  @Get()
  findAll() {
    return this.calculationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const calculation = await this.calculationsService.findOne(id);

    if (!calculation) {
      throw new NotFoundException('Calculation not found');
    }

    return calculation;
  }

  @Delete()
  deleteAll() {
    return this.calculationsService.deleteAll();
  }
}
