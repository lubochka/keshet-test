/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceDto } from './model/invoice.dto';
import { AuthGuard } from './auth.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('upsert')
  async upsertInvoice(@Body() invoice: InvoiceDto) {
    return this.invoiceService.upsertInvoice(invoice);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getInvoices(
    @Query('client') client?: string,
    @Query('title') title?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const filters: any = {};
    if (client) filters.client = { contains: client, mode: 'insensitive' };
    if (title) filters.title = { contains: title, mode: 'insensitive' };
    if (dateFrom || dateTo) {
      filters.updatedAt = {};
      if (dateFrom) filters.updatedAt.gte = new Date(dateFrom);
      if (dateTo) filters.updatedAt.lte = new Date(dateTo);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    return this.invoiceService.getInvoices(filters, skip, take);
  }
}
