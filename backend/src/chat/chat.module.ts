import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/typeorm/room.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageEntity } from 'src/typeorm/message.entity';
import { UserEntity } from 'src/typeorm/user.entity';
import { RoomUserEntity } from 'src/typeorm/roomUser.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, RoomEntity, RoomUserEntity, MessageEntity])
	],
	providers: [ChatService],
	controllers: [ChatController]
})
export class ChatModule {}
