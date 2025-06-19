import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  // In production, use a database
  private users = [
    { id: 1, username: 'test', passwordHash: bcrypt.hashSync('test', 10) },
    { id: 2, username: 'admin', passwordHash: bcrypt.hashSync('admin', 10) }
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = this.users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Return user data for JWT payload
    return { userId: user.id, username: user.username };
  }

  async login(user: { userId: number, username: string }) {
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

   verifyToken(token: string) {
    try {
      // The secret MUST match what you use for signing!
      return this.jwtService.verify(token, { secret: 'supersecret' });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}