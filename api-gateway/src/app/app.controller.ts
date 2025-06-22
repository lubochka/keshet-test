import { Controller, Get, Query,  Res, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { InvoicesService,InvoiceQueryDto } from './app.service';
import type { Response } from 'express';



@Controller('invoices')
@UseGuards(AuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async listInvoices(@Query() query:InvoiceQueryDto) {
    return this.invoicesService.listInvoices(query);
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string) {
    return this.invoicesService.getInvoice(id);
  }

  @Get(':id/pdf')
  async getInvoicePdf(@Param('id') id: string, @Res() res: Response) {
    await this.invoicesService.getInvoicePdf(id, res);
  }
}
