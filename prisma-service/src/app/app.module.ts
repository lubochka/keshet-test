import { Module } from '@nestjs/common';
import { InvoicesController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import {PrismaService} from './prisma.service'

@Module({
  imports: [],
  controllers: [InvoicesController],
  providers: [InvoiceService,PrismaService],
})
export class AppModule {}
