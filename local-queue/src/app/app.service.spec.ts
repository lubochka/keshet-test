import { Test } from '@nestjs/testing';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [QueueService],
    }).compile();

    service = app.get<QueueService>(QueueService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
