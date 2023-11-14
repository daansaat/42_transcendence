import { User } from "../UserContext";

export enum RoomType {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected',
	DIRECTMESSAGE = 'directmessage',
}

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}

export const GENERAL_CHAT = {
	roomId: 1,
	roomName: 'Transcendence',
	unreadMessages: 0,
	type: RoomType.PUBLIC,
	userRole: UserRole.MEMBER,
	unreadmessages: 0,
	isBanned: false,
	isKicked: false,
	isMuted: false,
	muteEndTime: new Date(),
}
export type Message = {
	id: number,
	userName: string,
	content: string,
	roomName: string,
};

export type Room = {
	roomId?: number;
	roomName: string;
	type: RoomType;
	password?: string;
};

export type UserDetails = {
	unreadMessages: number;
	userRole: UserRole;
	isMuted: boolean;
	isKicked: boolean;
	isBanned: boolean;
	muteEndTime: Date;
	contactName?: string;
};

export type NewRoomUser = {
	roomName: string,
	userName: string,
	userRole: UserRole,
	contactName?: string | null,
};

export type RoomUser = Room & UserDetails;
export type Member = User & UserDetails;
