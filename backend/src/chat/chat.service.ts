import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomDto } from 'src/dto/room.dto';
import { MessageDto } from 'src/dto/message.dto';
import { RoomEntity, GENERAL_CHAT, RoomType } from 'src/typeorm/room.entity';
import { MessageEntity } from 'src/typeorm/message.entity';
import { UserEntity } from 'src/typeorm/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RoomUserEntity } from 'src/typeorm/roomUser.entity';
import { NewRoomUserDto, RoomUserDto } from 'src/dto/roomUser.dto';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
	
	constructor(
		private dataSource: DataSource,
		@InjectRepository(RoomEntity)
		private roomRepository: Repository<RoomEntity>,
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(RoomUserEntity)
		private roomUserRepository: Repository<RoomUserEntity>,
	) {}

	async initializeGeneralChatRoom() {
		let generalChatRoom = await this.roomRepository.findOne({ where: { roomName: GENERAL_CHAT } });

		if (!generalChatRoom) {
			generalChatRoom = this.roomRepository.create({
			roomName: GENERAL_CHAT,
			type: RoomType.PUBLIC,
			});

		await this.dataSource.manager.save(generalChatRoom);
		}	
	}

	async createNewRoom(room: RoomDto): Promise<RoomDto> {
		const existingRoom = await this.roomRepository.findOne({ where: { roomName: room.roomName } });
		if (existingRoom && room.type !== RoomType.DIRECTMESSAGE) {
			throw new HttpException('Channel Name Already Exists', HttpStatus.CONFLICT);
		} else if (existingRoom && room.type === RoomType.DIRECTMESSAGE) {
			return existingRoom;
		} else {
			const newRoom = this.roomRepository.create({
				roomName: room.roomName,
				type: room.type,
				password: room.type === RoomType.PROTECTED ? await bcrypt.hash(room.password, 10) : null,
			});
			return await this.roomRepository.save(newRoom) as RoomDto;
		}
	}

	async addMessage(message: MessageDto): Promise<MessageDto> {
		const [user, room] = await Promise.all([
			this.userRepository.findOne({ where: { userName: message.userName } }),
			this.roomRepository.findOne({ where: { roomName: message.roomName } }),
		]);

		if (!user || !room)
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
	
		const newMessage = this.messageRepository.create({
			content: message.content,
			user: user,
			room: room,
		});
		await this.messageRepository.save(newMessage);

		return {
			id: newMessage.id,
			content: newMessage.content,
			userName: user.userName,
			roomName: room.roomName,
		}
	}

	async findRoomUser(roomName: string, userName: string): Promise<RoomUserEntity> {
		const roomUser = await this.roomUserRepository
		.createQueryBuilder('roomUser')
		.leftJoinAndSelect('roomUser.room', 'room')
		.leftJoinAndSelect('roomUser.user', 'user')
		.where('room.roomName = :roomName', { roomName })
		.andWhere('user.userName = :userName', { userName })
		.getOne();
		return roomUser;
	}

	async addRoomUser(newRoomUser: NewRoomUserDto) {
		let roomUser = await this.findRoomUser(newRoomUser.roomName, newRoomUser.userName);
		if (roomUser && !roomUser.isBanned) {
			return
		} else if (!roomUser) {
			const [room, user1] = await Promise.all([
				this.roomRepository.findOne({ where: {roomName: newRoomUser.roomName} }),
				this.userRepository.findOne({ where: {userName: newRoomUser.userName} }),
			]);
			let user2 = null;
			if(newRoomUser.contactName) {
				user2 = await this.userRepository.findOne({ where: {userName: newRoomUser.contactName} });
			}

			roomUser = this.roomUserRepository.create({
				userRole: newRoomUser.userRole,
				user: user1,
				room: room,
				contact: user2,
			});
			await this.roomUserRepository.save(roomUser);
		}

		const { roomId, roomName, type } = roomUser.room;
		const { userRole, unreadMessages, isMuted, isKicked, isBanned, contact } = roomUser;

		return {
			roomId,
			roomName,
			type,
			unreadMessages,
			userRole,
			isMuted,
			isKicked,
			isBanned,
			contactName: contact?.userName,
		} as RoomUserDto;
	}
	
	async removeRoomUser(roomName: string, userName: string): Promise<void> {
		const roomUser = await this.findRoomUser(roomName, userName);
		if (!roomUser) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		}
		await this.roomUserRepository.delete(roomUser.id);
	}

	async updateRoomUser(updatedRoomUser: RoomUserDto): Promise<RoomUserDto> {
		const roomUser = await this.findRoomUser(updatedRoomUser.roomName, updatedRoomUser.userName);
		if (!roomUser) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		roomUser.unreadMessages = updatedRoomUser.unreadMessages;
		roomUser.userRole = updatedRoomUser.userRole;
		roomUser.isBanned = updatedRoomUser.isBanned;
		roomUser.isKicked = updatedRoomUser.isKicked;
		roomUser.isMuted = updatedRoomUser.isMuted;
		roomUser.muteEndTime = updatedRoomUser.muteEndTime;
		await this.roomUserRepository.save(roomUser);
		const { unreadMessages, userRole, isBanned, isKicked, isMuted, muteEndTime } = roomUser;
		return {
			...updatedRoomUser,
			unreadMessages,
			userRole,
			isBanned,
			isKicked,
			isMuted,
			muteEndTime,
		} as RoomUserDto;
	}

	async updateRoom(roomUpdate: RoomDto): Promise<RoomDto> {
		const room = await this.roomRepository.findOne({
			where: { roomId: roomUpdate.roomId }
		});
		if (!room) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		room.password = roomUpdate.type === RoomType.PROTECTED ? await bcrypt.hash(roomUpdate.password, 10) : null;
		room.type = roomUpdate.type;
		await this.roomRepository.save(room);
		const { password, ...roomData } = room;
		return roomData as RoomDto
	}

	async checkPassword(room: RoomDto): Promise<boolean> {
		const findRoom = await this.roomRepository.findOne({
			where: {roomName: room.roomName}
		});
		if (!findRoom) {
			throw new HttpException('Room Not Found', HttpStatus.NOT_FOUND)
		}
		const isMatch = bcrypt.compare(room.password, findRoom.password);
		return isMatch;
	}
	
	async blockUser(blockerUserName: string, blockedUserName: string): Promise<UserDto[]> {
		const [blocker, blocked] = await Promise.all([
			this.userRepository.findOne({ 
				where: { userName: blockerUserName },
				relations: ['blocking'], 
			}),
			this.userRepository.findOne({ 
				where: { userName: blockedUserName },
			}),
		]);
		if (!blocker || !blocked) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		}
		blocker.blocking.push(blocked);
		await this.userRepository.save(blocker);
		const userData = blocker.blocking.map(({ id, userName, status }) => {
			return {
				id,
				userName,
				status
			}
		});
		return userData as UserDto[];
	}

	async unBlockUser(blockerUserName: string, blockedUserName: string): Promise<UserDto[]> {
		const [blocker, blocked] = await Promise.all([
			this.userRepository.findOne({ 
				where: { userName: blockerUserName },
				relations: ['blocking'], 
			}),
			this.userRepository.findOne({ 
				where: { userName: blockedUserName },
			}),
		]);
		if (!blocker || !blocked) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		}
		const index = blocker.blocking.findIndex(user => user.id === blocked.id);
		if (index !== -1) {
			blocker.blocking.splice(index, 1);
			await this.userRepository.save(blocker);
		};
		const userData = blocker.blocking.map(({ id, userName, status }) => {
			return {
				id,
				userName,
				status
			}
		});

		return userData as UserDto[]
	}

	async getBlockedUsers(userName: string): Promise<UserDto[]> {
		const user = await this.userRepository.findOne({ 
			where: { userName: userName },
			relations: ['blocking']
		});
		if (!user) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
		}
		const userData = user.blocking.map(({ id, userName, status }) => {
			return {
				id,
				userName,
				status,
			}
		});
		return userData as UserDto[];
	}

	async getAllPublicChatRooms(): Promise<RoomDto[]> {
		const rooms = await this.roomRepository
		.createQueryBuilder('room')
		.where('room.type != :private', { private: RoomType.PRIVATE })
		.andWhere('room.type != :directMessage', { directMessage: RoomType.DIRECTMESSAGE })
		.getMany();

		if (!rooms) {
			throw new HttpException('Rooms Not Found', HttpStatus.NOT_FOUND)
		}

		const roomData = rooms.map(({ roomId, roomName, type }) => ({
			roomId,
			roomName,
			type,
		}));
		return roomData as RoomDto[];
	}

	async getMyRooms(userName: string): Promise<RoomUserDto[]> {
		const user = await this.userRepository
		.createQueryBuilder('user')
		.leftJoinAndSelect('user.roomLinks', 'roomLinks')
		.leftJoinAndSelect('roomLinks.room', 'room')
		.leftJoinAndSelect('roomLinks.contact', 'contact')
		.where('user.userName = :userName', {userName})
		.getOne();
			
		if (!user) {
			throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
		}

		const roomUserData = user.roomLinks
			.map(({ room, unreadMessages, userRole, isMuted, muteEndTime, isBanned, isKicked, contact }) => {
				const { roomId, roomName, type } = room;
				return {
					roomId,
					roomName,
					type,
					unreadMessages,
					userRole,
					isMuted,
					isKicked,
					isBanned,
					muteEndTime,
					contactName: contact?.userName,
				}
			});
		return roomUserData as RoomUserDto[]
	}
		
	async getRoomMessages(roomName: string): Promise<MessageDto[]> {
		const room = await this.roomRepository
		.createQueryBuilder('room')
		.leftJoinAndSelect('room.messages', 'messages')
		.leftJoinAndSelect('messages.user', 'user')
		.where('room.roomName = :roomName', {roomName})
		.getOne()
		
		if (!room) {
			throw new HttpException('Room Not Found', HttpStatus.NOT_FOUND);
		}

		const messageData = room.messages.map(({ user, room, ...message }) => {
			const { userName } = user;
			return {
				userName,
				...message,
			}
		});
		return messageData as MessageDto[];
	}
		
	async getRoomMembers(roomName: string): Promise<RoomUserDto[]> {
		const room = await this.roomRepository
		.createQueryBuilder('room')
		.leftJoinAndSelect('room.userLinks', 'userLinks')
		.leftJoinAndSelect('userLinks.user', 'user')
		.where('room.roomName = :roomName', {roomName})
		.getOne();
		
		if(!room) {
			throw new HttpException('Room Not Found', HttpStatus.NOT_FOUND);
		}

		const userData = room.userLinks.map(({ user, userRole, isBanned, isKicked, isMuted, muteEndTime }) => {
			const { userName, intraId, avatar, status } = user;
			return {
				userName,
				avatar,
				intraId,
				status,
				userRole,
				isBanned,
				isKicked,
				isMuted,
				muteEndTime,
			} as RoomUserDto;
		});
		return userData as RoomUserDto[];
	}	
}
