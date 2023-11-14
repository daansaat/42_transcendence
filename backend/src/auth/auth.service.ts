import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {CreateUserDTO} from '../dto/create-user-dto'
import {UserI} from '../user/user.interface'
import * as speakeasy from 'speakeasy';
import { UserEntity } from 'src/typeorm/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
  ) {}
	

	async generateTwoFactorAuthenticationSecret(user: UserEntity) {
		const secret = speakeasy.generateSecret({ length: 20 });
		// console.log(secret.base32 + " burda")
		await this.userService.addAuthSecretKey(secret.base32, user)
		const qrCode = speakeasy.otpauthURL({
			secret: secret.ascii,
			label: user.intraName,
			issuer: 'Cida-trans',
		});
		return { qrCode, secret: secret.base32 }
	}

	verifyTwoFactorAuthentication(twoFactorCode: string, userSecret: string): boolean {
		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token: twoFactorCode,
		});
		return verified;
	}



	
}
