import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'supersecret', // In real world, use process.env.JWT_SECRET
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {}
