import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

@Injectable()
export class InvoicesService {
  private invoices = this.generateFakeInvoices(100);

  private generateFakeInvoices(count: number) {
    return Array.from({ length: count }).map((_, idx) => ({
      id: idx + 1,
      client: faker.company.name(),
      title: faker.finance.accountName(),
      amount: parseFloat(faker.finance.amount()),
      updatedAt:  faker.date.recent({ days: 30 }),
      status: faker.helpers.arrayElement(['pending', 'paid', 'overdue']),
      currency: faker.finance.currencyCode(),
      invoiceNumber: faker.string.uuid().slice(0, 8).toUpperCase(),
    }));
  }

  findAll(updatedSince?: Date) {
    if (updatedSince) {
      return this.invoices.filter(inv => new Date(inv.updatedAt) > updatedSince);
    }
    return this.invoices;
  }

  findOne(id: number) {
    return this.invoices.find(inv => inv.id === id);
  }
}