import { Test } from '@nestjs/testing';
import { InvoicesService } from './app.service';

describe('AppService', () => {
  let service: InvoicesService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [InvoicesService],
    }).compile();

    service = app.get<InvoicesService>(InvoicesService);
  });

});
