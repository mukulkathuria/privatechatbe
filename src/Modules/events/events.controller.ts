import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../auth/guards/wsjwt.guard';
import { joinedRoomDto, messageRoomDto } from './dto/joinroom.dto';
import { EventsService } from './events.service';
import {
  joinedRoomValidation,
  messageRoomValidation,
} from './validations/event.validations';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private readonly eventService: EventsService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinchatroom')
  async addedUser(
    @MessageBody() roomdata: joinedRoomDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { error } = joinedRoomValidation(roomdata);
    if (!error) {
      const { data, error: serverErr } =
        await this.eventService.adduserchatroom(roomdata);
      if (data) {
        client.join(data.chatroomid);
        this.server.to(data.chatroomid).emit('joinedUser', data);
      } else if (serverErr) {
        throw new WsException(serverErr);
      }
    } else {
      throw new WsException(error.message);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leavechatroom')
  async leaveroom(
    @MessageBody() roomdata: joinedRoomDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { error } = joinedRoomValidation(roomdata);
    if (!error) {
      const { data, error: serverErr } =
        await this.eventService.removeuserchatroom(roomdata);
      if (data) {
        this.server.to(data.chatroomid).emit('leaveroom', data);
        client.leave(data.chatroomid);
      } else if (serverErr) {
        throw new WsException(serverErr);
      }
    } else {
      throw new WsException(error.message);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: messageRoomDto): Promise<void> {
    const { error } = messageRoomValidation(data);
    if (!error) {
      const { userData } = await this.eventService.sendMessageRoom(data);
      if (userData) {
        this.server.to(userData.chatroomid).emit('message', userData);
      } else {
        throw new WsException('Chat room not available');
      }
    } else {
      throw new WsException('Chatroom is not available');
    }
  }
}