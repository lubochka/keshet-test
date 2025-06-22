import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { InvoiceDto } from './model/invoice.dto';
import { Response } from 'express';
import axios from 'axios';
import { Logger } from '@nestjs/common';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertInvoice(invoice: InvoiceDto) {
    return this.prisma.invoice.upsert({
      where: { id: invoice.id },
      update: { ...invoice },
      create: { ...invoice },
    });
  }

  async getInvoices(filters: any, skip: number, take: number) {
   Logger.log(
    `filters`,JSON.stringify( filters)
  );
    const [items, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: filters,
        skip,
        take,
      }),
      this.prisma.invoice.count({ where: filters }),
    ]);
    return { items, total };
  }
  
  async groupCountByStatus(filters: any) {
  const result = await this.prisma.invoice.groupBy({
    by: ['status'],
    _count: true,
    where: filters,
  });

  // Format result for clarity
  return result.map(r => ({ status: r.status, count: r._count }));
}
}

