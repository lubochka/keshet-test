import { Module } from '@nestjs/common';
import { InvoicesController } from './app.controller';
import { InvoicesService } from './app.service';

@Module({
  imports: [],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class AppModule {}
