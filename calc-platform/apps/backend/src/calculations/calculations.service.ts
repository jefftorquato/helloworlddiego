import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Calculation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalculationDto } from './create-calculation.dto';

@Injectable()
export class CalculationsService {
  private memoryStore: Calculation[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCalculationDto) {
    try {
      return await this.prisma.calculation.create({ data: dto });
    } catch {
      const calculation: Calculation = {
        id: randomUUID(),
        expression: dto.expression,
        result: dto.result,
        createdAt: new Date(),
      };
      this.memoryStore.push(calculation);
      return calculation;
    }
  }

  async findAll() {
    try {
      return await this.prisma.calculation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    } catch {
      return [...this.memoryStore]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 20);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.calculation.findUnique({ where: { id } });
    } catch {
      return this.memoryStore.find((item) => item.id === id) ?? null;
    }
  }

  async deleteAll() {
    try {
      return await this.prisma.calculation.deleteMany();
    } catch {
      this.memoryStore = [];
      return { count: 0 };
    }
  }
}
