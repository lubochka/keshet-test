import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import {PrismaService} from './prisma.service'

describe('InvoicesController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [InvoiceService,PrismaService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<InvoicesController>(InvoicesController);
      expect(appController.getInvoices()).toEqual({ message: 'Hello API' });
    });
  });
});
