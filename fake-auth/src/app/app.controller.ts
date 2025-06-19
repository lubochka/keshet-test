import { Controller, Get, Post, Body, UnauthorizedException  } from '@nestjs/common';
import { AuthService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user);
  }

   @Post('validate')
  async validate(@Body() body: { token: string }) {
    const decoded = this.authService.verifyToken(body.token);
    return { valid: true, user: decoded };
  }
}
