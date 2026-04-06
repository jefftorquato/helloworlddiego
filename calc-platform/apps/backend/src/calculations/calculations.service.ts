import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCalculationDto } from './create-calculation.dto';

@Injectable()
export class CalculationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCalculationDto) {
    return this.prisma.calculation.create({ data: dto });
  }

  findAll() {
    return this.prisma.calculation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  findOne(id: string) {
    return this.prisma.calculation.findUnique({ where: { id } });
  }

  deleteAll() {
    return this.prisma.calculation.deleteMany();
  }
}
