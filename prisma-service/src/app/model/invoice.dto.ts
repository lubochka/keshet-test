export class InvoiceDto {
  id: number;
  client: string;
  title: string;
  amount: number;
  updatedAt: Date;
  status: string;
  currency: string;
  invoiceNumber: string;
}