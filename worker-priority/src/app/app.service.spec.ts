import { Test } from '@nestjs/testing';
import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let service: WorkerService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [WorkerService],
    }).compile();

    service = app.get<WorkerService>(WorkerService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
