import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = auth.replace('Bearer ', '');
    try {
      // Validate with fake-auth
      const { data } = await axios.post('http://localhost:3000/validate', { token });
      req.user = data.user; // attach decoded info to request for downstream use
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
