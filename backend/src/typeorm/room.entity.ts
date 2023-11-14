import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { MessageEntity } from "./message.entity";
import { RoomUserEntity } from "./roomUser.entity";

export const GENERAL_CHAT = 'Transcendence'

export enum RoomType {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected',
	DIRECTMESSAGE = 'directmessage',
}

@Entity()
@Unique(['roomName'])
export class RoomEntity {

	@PrimaryGeneratedColumn()
	roomId: number;

	@Column()
	roomName: string;
	
	@Column()
	type: RoomType;

	@Column({ nullable: true })
	password: string;

	@OneToMany(() => MessageEntity, (message) => message.room)
	messages: MessageEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.room)
	userLinks: RoomUserEntity[];
}
