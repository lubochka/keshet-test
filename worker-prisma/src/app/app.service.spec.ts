import { Test } from '@nestjs/testing';
import { WorkerPrismaService } from './workerprisma.service';

describe('WorkerPrismaService', () => {
  let service: WorkerPrismaService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [WorkerPrismaService],
    }).compile();

    service = app.get<WorkerPrismaService>(WorkerPrismaService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.processQueue()).toEqual({ message: 'Hello API' });
    });
  });
});
