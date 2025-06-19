import { Controller, Post } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('sync')
  async manualSync() {
    await this.workerService.pollAndQueueInvoices();
    return { status: 'ok' };
  }
}