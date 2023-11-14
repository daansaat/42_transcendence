import { OnGatewayConnection, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "src/chat/chat.service";
import { Logger } from "@nestjs/common"; 
import { UserService } from "src/user/user.service";
import { MessageDto } from "src/dto/message.dto";
import { UserDto } from "src/dto/user.dto";
import { RoomUserDto } from "src/dto/roomUser.dto";
import { RoomDto } from "src/dto/room.dto";
import { GatewayService, Invite } from "./gateway.service";
import { GameService } from "../game/game.service";
import { Injectable } from '@nestjs/common';
import { GameType } from "src/typeorm/game.entity";


@Injectable()
export class MapService {
  private _userToSocketId = new Map<number, string>();
  get userToSocketId() {
    return this._userToSocketId;
  }
}

@WebSocketGateway( {
	cors: {
		origin: ['http://f1r1s3.codam.nl:3000']
	}
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect{
	private logger: Logger = new Logger('MyGateway');

	@WebSocketServer()
	server: Server;

	constructor(
		private chatService: ChatService,
		private userService: UserService,
		private gameService: GameService,
		private gatewayService: GatewayService,
		private mapService: MapService) {}
		

	async handleConnection(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client connected: [${userSocket.name}][${userSocket.intraId}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);

		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			return
		}
		client.join(user.intraId);
		client.join(user.id.toString());
		client.emit('userId', user.id);
		this.mapService.userToSocketId.set(user.id, client.id);
		await this.userService.updateStatus(userSocket.name, 'online');
		this.onUserUpdate();
	}
	
	async handleDisconnect(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client disconnected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);
		
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (user) {
			await this.gatewayService.handleInQueueDisconnection((user.id));
			await this.gatewayService.handleInGameDisconnection(user.id);
			await this.gatewayService.handleInviteDisconnection(user.id);
		}
		
		await this.userService.updateStatus(userSocket.name, 'offline');
		this.onUserUpdate();
	}
	
	@SubscribeMessage('userUpdate')
	async onUserUpdate() {
		const users = await this.userService.getAllUsersStatus();
		this.server.emit('onUserUpdate', users);
	}

	//////////////////////////// CHAT /////////////////////////////////////////////////////

	@SubscribeMessage('memberUpdate')
	async onMemberUpdate(@MessageBody() roomName: string) {
		this.server.to(roomName).emit('onMemberUpdate', roomName)
	}

	@SubscribeMessage('joinRoom')
	async onJoinRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
		client.join(roomName);
		this.onMemberUpdate(roomName)
	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
		client.leave(roomName);
		this.onMemberUpdate(roomName)
	}

	@SubscribeMessage('roomInvite')
	async onRoomInvite(@MessageBody() roomUser: RoomUserDto) {
		this.server.to(roomUser.intraId).emit('onRoomInvite', roomUser);
	}

	@SubscribeMessage('roomUserUpdate')
	async onRoomUserUpdate(@MessageBody() roomUser: RoomUserDto) {
		this.server.to(roomUser.intraId).emit('onRoomUserUpdate', roomUser);
	}

	@SubscribeMessage('removeRoomUser')
	async onRemoveRoomUser(@MessageBody() roomUser: RoomUserDto) {
		this.server.to(roomUser.intraId).emit('onRemoveRoomUser', roomUser.roomName);
	}

	@SubscribeMessage('roomUpdate')
	async onRoomUpdate(@MessageBody() roomUpdate: RoomDto) {
		this.server.to(roomUpdate.roomName).emit('onRoomUpdate', roomUpdate);
	}
	
	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: MessageDto) {
		const newMessage = await this.chatService.addMessage(message);
		this.server.to(newMessage.roomName).emit('onMessage', newMessage);
	}

	@SubscribeMessage('blockUser')
	async onBlockUser(@MessageBody() { user, blockedUser }: { user: UserDto, blockedUser: UserDto }) {
		await this.userService.blockUser(user.userName, blockedUser.userName); // do with http?
		this.server.to(blockedUser.id.toString()).emit('blockedBy', user);
	}

	////////////////////////// GAME ///////////////////////////////////////

	@SubscribeMessage('matchMaking')
	async handleMatchMaking( @MessageBody() data: { type: GameType }, @ConnectedSocket() client: Socket ) {
		if (!client || !("type" in data)) {
			client.emit('error', "No connection or no type!"); ///null oldugu duruma bak  frontende koy
			return;
		}
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		if (this.gatewayService.isInviting(user.id)) {
			client.emit('error', 'No random game after sending an invitation');
            return;
        }
		if (!this.gatewayService.isInGame(user.id)) {
			client.emit('error', 'In the game');
            return;
        }
		// console.log(data);
		// errorler icin bisi koy
		const resQueued = this.gatewayService.addUserToQueue(user.id, data.type);
		if (resQueued.status !== true) {
			client.emit('error', resQueued.message);
			return;
		}
		client.emit('queued');
		const resMatching = await this.gatewayService.findMatch();
		if (resMatching.status !== true) {
			client.emit('error', resMatching.message);
            return;
        }
		const [user1, user2] = resMatching.payload;
		const socket1Id = this.mapService.userToSocketId.get(user1.id);
		const socket2Id = this.mapService.userToSocketId.get(user2.id);
		const socket1 = this.server.sockets.sockets.get(socket1Id);
		const socket2 = this.server.sockets.sockets.get(socket2Id);
		
		socket1.emit('matchFound'); //bu oldugunda bir insatlling effecti koyabilirsin?
		socket2.emit('matchFound'); //bu oldugunda bir insatlling effecti koyabilirsin?
		const gameId = [resMatching.payload[0].id, resMatching.payload[1].id].sort().join('vs');
		socket1.join(`game${gameId}`);
		socket2.join(`game${gameId}`);
		// if (socket1.rooms.has(`game${gameId}`) && socket2.rooms.has(`game${gameId}`)) {
		// 	console.log(`two users are in the room game${gameId}`);
		// } else {
		// 	console.log(`Error: One or both users have not joined game room: game${gameId}`);
		// }
		const resGameCreate = await this.gatewayService.createGame(this.server, resMatching.payload[0], resMatching.payload[1], data.type);
		if (resGameCreate.status !== true) {
			if (resGameCreate.message)
			// client.emit('error', resGameCreate.message);
			socket1.leave(`game${gameId}`);
			socket2.leave(`game${gameId}`);
			return;
		}
		
		// this.server.to(`game${gameId}`).emit('success', `Found match! Starting the game...`);
		this.server.to(`game${gameId}`).emit('game_info', { p1: resMatching.payload[0].id, p2: resMatching.payload[1].id });
		this.server.to(`game${gameId}`).emit('gameFound');
		// if(user.id === resMatching.payload[0].id) {
		this.gameService.startGame(this.gatewayService.getGameByGameId(gameId));
		// }
		// return;
	}

	@SubscribeMessage('cancelMatching')
    async cancelMatch( @ConnectedSocket() client: Socket ) {
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		const resUnqueued = this.gatewayService.deleteUserFromQueue(user.id);
		if (resUnqueued.status !== true) {
			client.emit('error', resUnqueued.message);
			return;
		}
        client.emit('gameUnqueued');
    }

	@SubscribeMessage('Invite')
    async inviteUser( @MessageBody() data: { userName: string, type: GameType }, @ConnectedSocket() client: Socket ) {
		// console.log(data.type,'............');
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'invalid user');
			return;
		}
        if (!data.userName) {
			client.emit('error', 'empty username');
            return;
        }
		// console.log( await this.userService.findUserByUserName(data.userName))
        const target = await this.userService.findUserByUserName(data.userName);
		if (!target) {
			client.emit('error', 'Invalid user');
			return;
		}
		// this.gatewayService.uninviteUser(user.id, target?.id );
        const res = await this.gatewayService.inviteUser(user.id, target?.id, data.type );
        if (res.status !== true) {
			client.emit('error', res.message);
            return;
        }
        const invite = this.gatewayService.getInvites(target.id).find(i => i.id === user.id);
		client.emit('invitesent', { ...invite, userName: target.userName });
        this.sendSocketMsgByUserId(target.id, 'gameinvite', { ...invite, userName: user.userName, id: user.id });
    }

    @SubscribeMessage('Uninvite')
    async UninviteUser( @MessageBody() data: { userName: string }, @ConnectedSocket() client: Socket ) {
        const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
        if (!user || !data.userName ) {
            client.emit('error');
            return;
        }
        const target = await this.userService.findUserByUserName(data.userName);
        const res = this.gatewayService.deleteInvite(target.id, user.id);
        if (res.status !== true) {
			client.emit('error', res.message);
            return;
        }
		// console.log('yes');
        client.emit('invitationDeleted', { ...res.payload, userName: target.userName });
        this.sendSocketMsgByUserId(target.id, 'invitationDeleted', { ...res.payload, userName: user.userName });
        this.sendSocketMsgByUserId(target.id, 'warning', `cancelled their invitation`);
    }

    @SubscribeMessage('AcceptInvitation')
    async acceptInvitation( @MessageBody() data: Invite, @ConnectedSocket() client: Socket ) {
		const userSocket = client.handshake.auth;
		const userDto = await this.userService.findUserByUserName(userSocket.name);
		const user = await this.userService.findUserByUserId(userDto.id);
        if (!user || !('id' in data)) {
			client.emit('error', "Invalid data");
            return;
        }
        const target = await this.userService.findUserByUserId(data.id);
        const res = this.gatewayService.deleteInvite(user.id, target?.id);
        if (res.status !== true) {
			client.emit('error', res.message);
            return;
        }
        const resGameCreate = await this.gatewayService.createGame(this.server, user, target, GameType.CLASSIC);
        if (resGameCreate.status !== true) {
			client.emit('error', resGameCreate.message);
            return;
        }
		const socketId = this.mapService.userToSocketId.get(target.id);
		const socket = this.server.sockets.sockets.get(socketId);
        if (this.gatewayService.invites.has(resGameCreate.payload[0].player.id)) {
			const invites = this.gatewayService.invites.get(resGameCreate.payload[0].player.id);
            invites.forEach((invite) => {
				this.refuseInvite(invite, socket);
            });
        }
        if (this.gatewayService.invites.has(resGameCreate.payload[1].player.id)) {
			const invites = this.gatewayService.invites.get(resGameCreate.payload[1].player.id);
            invites.forEach((invite) => {
				this.refuseInvite(invite, socket);
            });
        }
        const gameId = [resGameCreate.payload[0].player.id, resGameCreate.payload[1].player.id].sort().join('vs');
        client.join(`game${gameId}`);
        socket.join(`game${gameId}`);
        // Notify and remove invite from store
        client.emit('gameAccepted', `You accepted ${target.userName}'s invite`);
        socket.emit('gameAccepted', `Your invitation accepted by ${user.userName}`);
        // client.emit('game_invite_del', { ...res.payload, userName: user.userName });
        this.sendSocketMsgByUserId(target.id, 'success', `${user.userName} accepted your invite`);
        this.sendSocketMsgByUserId(user.id, 'game_invite_accepted', { ...res.payload, userName: user.userName });
        // Stop queue animation and send to game page??
        this.server.to(`game${gameId}`).emit('game_info', { p1: user.id, p2: target.id });
        this.server.to(`game${gameId}`).emit('gameFound');
        this.gameService.startGame(this.gatewayService.getGameByGameId(gameId));
    }

    @SubscribeMessage('RejectInvitation')
    async refuseInvite( @MessageBody() data: Invite, @ConnectedSocket() client: Socket ) {
        const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		// const user = await this.userService.findUserByUserId(userDto.id);
        const target = await this.userService.findUserByUserId(data.id);
        const res = this.gatewayService.deleteInvite(user.id, target?.id);
        if (res.status !== true) {
            client.emit('error', res.message);
            return;
        }
        // client.emit('inviteDeleted', { ...res.payload, userName: user.userName });
        this.sendSocketMsgByUserId(target.id, 'inviteRefused', `Your friend rejected your invite`);
    }
	
	@SubscribeMessage('keyDown')
    async KeyDown( @MessageBody() data: string, @ConnectedSocket() client: Socket ) {
        if (!client || !['w', 's'].includes(data)) {
            client.emit('error', "Invalid data");
            return ;
        }
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
        if (!user) {
            client.emit('error', 'Invalid user');
            return ;
        }

        let move = 0;
        if (data === 'w') move = -1;
        if (data === 's') move = 1;

        const res = this.gatewayService.movePaddle(user.id, move);
        if (res.status !== true) {
            return;
        }
    }

	@SubscribeMessage('keyUp')
    async KeyUp( @MessageBody() data: string, @ConnectedSocket() client: Socket ) {
        if (!client || !['w', 's'].includes(data)) {
            client.emit('error', "Invalid data");
            return ;
        }
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
        if (!user) {
            client.emit('error', 'Invalid user');
            return ;
        }
        let move = 0;
        const res = this.gatewayService.movePaddle(user.id, move);
        if (res.status !== true) {
            return;
        }
    }

	@SubscribeMessage('gameExited')
    async gameExited( @ConnectedSocket() client: Socket ) {
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
        if (!user) {
            client.emit('error', 'Invalid user');
            return ;
        }
        // let move = 0;
        // const res = this.gatewayService.movePaddle(user.id, move);
        // if (res.status !== true) {
        //     return;
        // }
		const game = await this.gatewayService.findUserGame(user.id);
		await this.gatewayService.exitGame(user.id, game);
    }

	async sendSocketMsgByUserId(userId: number, event: string, payload: any = null) {
        const client = await this.userService.findUserByUserId(userId);
        const isClientOnline = client.isLogged;
        if (isClientOnline) {
			// console.log('isclient online');
			const socketId = this.mapService.userToSocketId.get(client.id);
			const socket = this.server.sockets.sockets.get(socketId);
			if (socket) {
				socket.emit(event, payload);
			} else {
				console.log(`No socket found for ID: ${socketId}`);
			}
        }
    }
}
