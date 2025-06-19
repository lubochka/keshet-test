import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { InvoiceDto } from './model/invoice.dto';

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
}
