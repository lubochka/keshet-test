import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

export class InvoiceQueryDto {
  client?: string;
  title?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;    // or number if you parse it
  limit?: string;   // or number if you parse it
}
@Injectable()
export class InvoicesService {
  async listInvoices(query: InvoiceQueryDto) {
    const { data } = await axios.get('http://localhost:3005/invoices', { params: query });
    return data;
  }

  async getInvoice(id: string) {
    const { data } = await axios.get(`http://localhost:3005/invoices`, { params: { id } });
    if (Array.isArray(data.items)) {
      return data.items[0] || {};
    }
    return data;
  }

  async getInvoicePdf(id: string, res: Response) {
    const pdfRes = await axios.get(`http://localhost:3001/invoices/${id}/pdf`, { responseType: 'stream' });
    res.setHeader('Content-Type', 'application/pdf');
    pdfRes.data.pipe(res);
  }
}
