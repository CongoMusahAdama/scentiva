import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      'https://scentivaaura.shop',
      'https://www.scentivaaura.shop',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
      /\.netlify\.app$/,
    ].filter(Boolean),
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinAdmin')
  handleJoinAdmin(client: Socket) {
    client.join('admin');
    this.logger.log(`Client ${client.id} joined admin room`);
  }

  @SubscribeMessage('joinUser')
  handleJoinUser(client: Socket, userId: string) {
    client.join(`user_${userId}`);
    this.logger.log(`Client ${client.id} joined user_${userId} room`);
  }

  sendToAdmin(event: string, data: any) {
    this.server.to('admin').emit(event, data);
  }

  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
