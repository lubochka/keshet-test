import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  // Store the last sync timestamp in memory (can be persisted)
  private lastSync = new Date(0); // Start at epoch for initial full sync

  async pollAndQueueInvoices() {
    this.logger.log(`Polling fake-priority since ${this.lastSync.toISOString()}`);
    // 1. Pull updated invoices from fake-priority
    const res = await axios.get('http://localhost:3001/api/invoices', {
      params: { updatedSince: this.lastSync.toISOString() },
    });
    const invoices = res.data as any[];
    this.logger.log(`Fetched ${invoices.length} updated invoices`);
    // 2. Push each to the queue as an "invoice_updated" event
    for (const inv of invoices) {
      await axios.post('http://localhost:3002/api/queue', {
        type: 'invoice_updated',
        payload: inv,
      });
    }
    // 3. Update lastSync to the newest invoice's updatedAt, if any
    if (invoices.length) {
      const maxDate = invoices
        .map(inv => new Date(inv.updatedAt))
        .reduce((a, b) => (a > b ? a : b), this.lastSync);
      this.lastSync = maxDate;
    }
  }
}