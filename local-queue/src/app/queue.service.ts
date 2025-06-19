import { Injectable } from '@nestjs/common';

export interface QueueEvent {
  id: string;
  type: string; // e.g. "invoice_updated", "invoice_created"
  payload: any;
  createdAt: Date;
}

@Injectable()
export class QueueService {
  private queue: QueueEvent[] = [];

  enqueue(event: Omit<QueueEvent, 'id' | 'createdAt'>) {
    const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const queueEvent: QueueEvent = {
      ...event,
      id,
      createdAt: new Date(),
    };
    this.queue.push(queueEvent);
    return queueEvent;
  }

  // For polling: get and remove first event
  dequeue(): QueueEvent | null {
    return this.queue.shift() || null;
  }

  // For peeking (debugging)
  peek(): QueueEvent[] {
    return [...this.queue];
  }

  // For cleaning up (e.g. after test/demo)
  clear() {
    this.queue = [];
  }
}