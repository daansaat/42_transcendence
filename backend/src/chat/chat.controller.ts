import { Post, Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RoomDto } from 'src/dto/room.dto';
import { MessageDto } from 'src/dto/message.dto';
import { NewRoomUserDto, RoomUserDto } from 'src/dto/roomUser.dto';
import { UserDto } from 'src/dto/user.dto';
import { AuthenticatedGuard } from 'src/auth/oauth/oauth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('chat')
export class ChatController {

	constructor(private chatService: ChatService) {}

	@Post('newRoom') 
	async createNewRoom(@Body() newRoom: RoomDto): Promise<RoomDto> {
		return await this.chatService.createNewRoom(newRoom);
	}

	@Post('addRoomUser')
	async addRoomUser(@Body() roomUser: NewRoomUserDto): Promise<RoomUserDto> {
		return await this.chatService.addRoomUser(roomUser);
	}

	@Put('updateRoom')
	async UpdateRoom(@Body() updatedRoom: RoomDto): Promise<RoomDto> {
		return await this.chatService.updateRoom(updatedRoom);
	}

	@Put('updateRoomUser')
	async UpdateRoomUser(@Body() updatedRoomUser: RoomUserDto): Promise<RoomUserDto> {
		return await this.chatService.updateRoomUser(updatedRoomUser);
	}

	@Put('removeRoomUser/:roomName/:userName/')
	async removeRoomUserLinks(
		@Param('roomName') roomName: string,
		@Param('userName') userName: string) {
		return await this.chatService.removeRoomUser(roomName, userName);
	}

	@Put('block/:blocker/:blocked')
	async blockUser(
		@Param('blocker') blockerUserName: string,
		@Param('blocked') blockedUserName: string,
	): Promise<UserDto[]> {
		return await this.chatService.blockUser(blockerUserName, blockedUserName);
	}

	@Put('unblock/:blocker/:blocked')
	async unBlockUser(
		@Param('blocker') blockerUserName: string,
		@Param('blocked') blockedUserName: string,
	): Promise<UserDto[]> {
		return await this.chatService.unBlockUser(blockerUserName, blockedUserName);
	}

	@Get('blocked/:userName')
	async getBlockedUsers(
		@Param('userName') userName: string
	): Promise<UserDto[]> {
		return await this.chatService.getBlockedUsers(userName);
	}

	@Get('publicRooms')
	async getAllPublicChatRooms(): Promise<RoomDto[]> {
		return await this.chatService.getAllPublicChatRooms();
	}
	
	@Get('myRooms/:userName')
	async getMyRooms(
		@Param('userName') userName: string): Promise<RoomUserDto[]> {
		return await this.chatService.getMyRooms(userName);
	}

	@Get('messages/:roomName')
	async getRoomMessages(
		@Param('roomName') roomName: string): Promise<MessageDto[]> {
		return this.chatService.getRoomMessages(roomName);
	}

	@Get('members/:roomName')
	async getRoomMembers(
		@Param('roomName') roomName: string
	): Promise<RoomUserDto[]> {
		return await this.chatService.getRoomMembers(roomName);
	}
	
	@Post('password')
	async checkPassword(@Body() room: RoomDto): Promise<boolean> {
		return await this.chatService.checkPassword(room);
	}
}
