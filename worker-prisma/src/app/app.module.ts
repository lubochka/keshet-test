import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerPrismaService } from './workerprisma.service';

@Module({
  imports: [],
  controllers: [WorkerController],
  providers: [WorkerPrismaService],
})
export class AppModule {}
