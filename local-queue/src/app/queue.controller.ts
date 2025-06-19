import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { QueueService, QueueEvent } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  // POST /queue (add an event)
  @Post()
  addEvent(@Body() body: { type: string; payload: any }) {
    return this.queueService.enqueue(body);
  }

  // GET /queue (poll for the next event)
  @Get()
  getEvent() {
    const event = this.queueService.dequeue();
    return event ? event : { event: null };
  }

  // GET /queue/peek (peek at all events, no dequeue)
  @Get('peek')
  peekQueue() {
    return this.queueService.peek();
  }

  // DELETE /queue (clear all events)
  @Delete()
  clearQueue() {
    this.queueService.clear();
    return { cleared: true };
  }
}