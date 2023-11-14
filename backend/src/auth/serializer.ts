import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import {UserEntity} from '../typeorm/user.entity';
import { UserService } from '../user/user.service';
import { UserI } from 'src/user/user.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly userService: UserService) {
		super();
	}

	/* after successful authentication passport uses serializeUser  */
	serializeUser(user: UserEntity, done: (err: Error, user: UserI) => void)  {
		done(null, user);
	}


	async deserializeUser(user: UserEntity, done: (err: Error, user: UserI) => void) {
		const userDB: UserI = await this.userService.findByintraId(
			user.intraId,
		);
		return userDB ? done(null, userDB) : done(null, null);
	}
}
