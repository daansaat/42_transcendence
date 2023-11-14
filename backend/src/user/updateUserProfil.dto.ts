import {
	IsString,
	IsNotEmpty,
	Matches,
} from 'class-validator';

export class UpdateUserProfileDto {
	id: number;

	intraId: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^[A-Za-z0-9][A-Za-z0-9 ]*[A-Za-z0-9]$/)
	userName: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
}
