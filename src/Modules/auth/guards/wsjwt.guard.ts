import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { validateToken } from '../strategies/jwt.strategy';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const server: Server = context.switchToWs().getClient<Server>();
    const { authorization } = request.handshake?.headers;
    const { data, error } = validateToken(authorization);
    if (data) {
      request.username = data.username;
      return true;
    } else {
      if (error.status === 403) {
        server.emit('tokenexpired', 'Token not vaid');
      } else {
        server.emit('invalidUser', error.message);
      }
      throw new WsException(error.message);
    }
  }
}
