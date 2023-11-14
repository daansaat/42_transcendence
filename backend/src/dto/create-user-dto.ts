import {
	IsString,
	IsNotEmpty,
	Matches,
} from 'class-validator';

export class CreateUserDTO{
    intraId: string;
    
    @IsString()
	@IsNotEmpty()
    avatar: string;

    @IsString()
	@IsNotEmpty()
	@Matches(/^[A-Za-z0-9][A-Za-z0-9 ]*[A-Za-z0-9]$/)
    userName: string;
    avatarSmall:string;
    isLogged:boolean;
    intraName:string;
}