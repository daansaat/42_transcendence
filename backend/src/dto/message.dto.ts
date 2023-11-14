import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class MessageDto {
	@IsNumber()
	id: number;

	@IsString()
	userName: string;

	@IsString()
	@MaxLength(100)
	content: string;

	@IsOptional()
	@IsString()
	roomName?: string;
}
