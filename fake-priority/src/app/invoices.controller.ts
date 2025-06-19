import { Controller, Get, Param, Query, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import PDFDocument from 'pdfkit';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Query('updatedSince') updatedSince?: string) {
    const date = updatedSince ? new Date(updatedSince) : undefined;
    return this.invoicesService.findAll(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const invoice = this.invoicesService.findOne(+id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Res() res: Response) {
    const invoice = this.invoicesService.findOne(+id);
    if (!invoice) {
      res.status(404).send('Invoice not found');
      return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice_${id}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Client: ${invoice.client}`);
    doc.text(`Title: ${invoice.title}`);
    doc.text(`Amount: ${invoice.amount} ${invoice.currency}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Updated: ${invoice.updatedAt.toISOString()}`);
    doc.end();
  }
}