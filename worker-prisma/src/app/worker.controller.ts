import { Controller, Post } from '@nestjs/common';
import { WorkerPrismaService } from './workerprisma.service';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerPrismaService) {}

  @Post('process')
  async manualProcess() {
    await this.workerService.processQueue();
    return { status: 'ok' };
  }
}