import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class WorkerPrismaService {
  private readonly logger = new Logger(WorkerPrismaService.name);

   @Cron('*/10 * * * * *') // every 10 seconds
  async scheduledProcess() {
    await this.processQueue();
  }
  // Main worker loop
  async processQueue() {
    try {
      // 1. Poll the queue for the next event (removes from queue)
      const { data: event } = await axios.get('http://localhost:3002/api/queue');
      if (!event || !event.type) {
        this.logger.log('No events in queue.');
        return;
      }
      this.logger.log(`Processing event: ${event.type} (${event.id})`);

      // 2. If it's an invoice update, send to prisma-service
      if (event.type === 'invoice_updated') {
        await axios.post('http://localhost:3003/api/invoices/upsert', event.payload);
        this.logger.log(`Upserted invoice ${event.payload.id}`);
      }
      // Add more event types here if needed
    } catch (err) {
      this.logger.error(`Error processing queue: ${err}`);
    }
  }
}