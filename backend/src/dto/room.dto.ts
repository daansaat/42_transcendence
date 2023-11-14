import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { RoomType } from "src/typeorm/room.entity";

export class RoomDto {
	@IsOptional()
	@IsNumber()
	roomId?: number;

	@IsString()
	@MaxLength(25)
	roomName: string;

	@IsEnum(RoomType)
	type: RoomType;

	@IsOptional()
	@MaxLength(25)
	password?: string;
}
