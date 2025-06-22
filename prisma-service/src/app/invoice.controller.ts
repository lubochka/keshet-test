/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Controller, Get, Post, Body, Query, UseGuards, Param,Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceDto } from './model/invoice.dto';
import { AuthGuard } from './auth.guard';
import type {Response} from 'express';

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
    @Query('id') id?: string,
    @Query('client') client?: string,
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const filters: any = {};
    if (id) {
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      filters.id = numericId;
    } else {
      filters.id = { contains: id, mode: 'insensitive' }; // fallback for string ID (e.g., UUID)
    }
  }
   if (status) {
    filters.status = status;
  }
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

   @UseGuards(AuthGuard)
   @Get(':id/pdf')
  async getInvoicePdf(@Param('id') id: string, @Res() res: Response) {
    await this.invoiceService.getInvoicePdf(id, res);
  }

  
}
