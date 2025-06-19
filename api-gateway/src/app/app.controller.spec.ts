import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './app.controller';
import { InvoicesService } from './app.service';

describe('InvoicesController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [InvoicesService],
    }).compile();
  });

  
});
