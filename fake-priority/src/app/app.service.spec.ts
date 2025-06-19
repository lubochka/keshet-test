import { Test } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [InvoicesService],
    }).compile();

    service = app.get<InvoicesService>(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
