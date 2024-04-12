import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers.authorization.replace('Bearer', '').trim();
      request.user = await this.jwtService.verify(token);
      return true;
    } catch (error) {
      const message =
        error.name === 'TokenExpiredError'
          ? 'Session expirada'
          : 'Usuario no autorizado';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
