import { Test, TestingModule } from '@nestjs/testing';
import { WorkerController } from './worker.controller';
import { WorkerPrismaService } from './workerprisma.service';

describe('WorkerController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [WorkerController],
      providers: [WorkerPrismaService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<WorkerController>(WorkerController);
      expect(appController.manualProcess()).toEqual({status: 'ok'  });
    });
  });
});
