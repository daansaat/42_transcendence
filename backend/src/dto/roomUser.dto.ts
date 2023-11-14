import { RoomType } from "src/typeorm/room.entity";
import { UserRole } from "src/typeorm/roomUser.entity";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class RoomUserDto {
	@IsOptional()
	@IsNumber()
	roomId?: number;

	@IsOptional()
	@IsString()
	roomName?: string;

	@IsOptional()
	@IsString()
	userName?: string;

	@IsOptional()
	@IsString()
	intraId?: string;

	@IsOptional()
	@IsEnum(RoomType)
	type?: RoomType;

	@IsOptional()
	@IsNumber()
	unreadMessages?: number;

	@IsOptional()
	@IsEnum(UserRole)
	userRole?: UserRole;

	@IsOptional()
	@IsBoolean()
	isMuted?: boolean;

	@IsOptional()
	muteEndTime?: Date;

	@IsOptional()
	@IsBoolean()
	isKicked?: boolean;

	@IsOptional()
	@IsBoolean()
	isBanned?: boolean;

	@IsOptional()
	@IsString()
	contactName?: string;

	@IsOptional()
	@IsString()
	status?: string;
}

export class NewRoomUserDto {
	@IsString()
	roomName: string;

	@IsString()
	userName: string;

	@IsEnum(UserRole)
	userRole: UserRole;

	@IsOptional()
	@IsString()
	contactName?: string;
};
