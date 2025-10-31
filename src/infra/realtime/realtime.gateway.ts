import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@features/auth/strategies/jwt.strategy';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private connectedUsers = new Map<string, AuthenticatedSocket>();
  private usersCount = 0;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extrair token do handshake
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (token) {
        try {
          const payload = this.jwtService.verify<JwtPayload>(token as string, {
            secret:
              this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
          });

          client.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
          };

          this.logger.log(
            `User connected: ${client.user.email} (${client.id})`,
          );
        } catch (error) {
          this.logger.warn(`Invalid token for client ${client.id}`);
          // Permite conexão não autenticada para eventos públicos
        }
      } else {
        this.logger.log(`Anonymous client connected: ${client.id}`);
      }

      this.connectedUsers.set(client.id, client);
      this.usersCount = this.connectedUsers.size;
      this.broadcastUsersCount();
    } catch (error) {
      this.logger.error(`Error handling connection: ${error}`);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
    this.usersCount = this.connectedUsers.size;
    this.broadcastUsersCount();
  }

  @SubscribeMessage('realtime:ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.debug(`Ping from client ${client.id}:`, data);
    return {
      event: 'realtime:pong',
      data: { message: 'pong', received: data },
    };
  }

  @SubscribeMessage('realtime:secure-echo')
  handleSecureEcho(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.user) {
      throw new UnauthorizedException('Authentication required');
    }

    this.logger.debug(`Secure echo from user ${client.user.email}:`, data);
    return {
      event: 'realtime:secure-echo-response',
      data: {
        message: 'echo',
        received: data,
        user: client.user,
      },
    };
  }

  @SubscribeMessage('realtime:message')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.logger.debug(`Message from client ${client.id}:`, data);

    // Broadcast message to all connected clients
    this.server.emit('realtime:message', {
      from: client.user?.email || 'anonymous',
      message: data,
      timestamp: new Date().toISOString(),
    });

    return {
      event: 'realtime:message-sent',
      data: { success: true },
    };
  }

  private broadcastUsersCount() {
    this.server.emit('realtime:users', { count: this.usersCount });
  }

  // Método auxiliar para emitir eventos para todos os clientes
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Método auxiliar para emitir eventos para usuários autenticados
  broadcastToAuthenticated(event: string, data: any) {
    this.connectedUsers.forEach((client) => {
      if (client.user) {
        client.emit(event, data);
      }
    });
  }
}
