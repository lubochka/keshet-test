import { Test } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [InvoiceService],
    }).compile();

    service = app.get<InvoiceService>(InvoiceService);
  });

});
