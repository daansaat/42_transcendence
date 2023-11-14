import { Controller, Get, Res, Req, Param, UseGuards, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard, OAuthGuard } from './oauth/oauth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as qrcode from 'qrcode';
import { AfterLoad } from 'typeorm';


@Controller('auth')
export class AuthController {

	constructor(private userService: UserService,  
		private authService: AuthService) {}
	
	@Get('login')
	@UseGuards(OAuthGuard)
	login() {

		return ;
	}



	@Get('logout')
	@UseGuards(AuthenticatedGuard)
	async logout(@Req() req, @Res() res) {
		this.userService.updateLogIn(req.user.userName, false)
		req.logout(() => {
			res.redirect('http://f1r1s3.codam.nl:3000/login');
		  });
	}

	@Get('redirect')
	@UseGuards(OAuthGuard)
	async callback(@Req() req, @Res() res)
	{
		const user = req.user;
		req.login(user, (err) => {
			if(err){
				console.log("Login Error");
			}
			else
				console.log("Login succes");
		});
		this.userService.updateLogIn(user.userName,true);
		// console.log("redirect : " + JSON.stringify(user));
		if(user.TwoFactorAuth)
			res.redirect(`http://f1r1s3.codam.nl:3000/verify2fa`)
		else
			res.redirect(`http://f1r1s3.codam.nl:3000/home`);
	}


	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req) {
		if(!req.user){
			window.location.href = '/login'
		}
		else{
			delete req.user.twoFactorAuthSecret
			delete req.user.totalLoose
			delete req.user.totalWin
			delete req.user.score
			delete req.user.rank
			delete req.user.inGame
			return req.user;
		}
	}


	@Post('disabled2fa')
	@UseGuards(AuthenticatedGuard)
	async disabled2fa(@Req()req, @Res() res):Promise<Boolean | any>{
		 return await this.userService.disabledTwoFactor(req.user);;
	}


	@Get('enable2fa')
	@UseGuards(AuthenticatedGuard)
	async enableTwoFactor(@Req() req, @Res() res) {
		const tfa = await this.authService.generateTwoFactorAuthenticationSecret(req.user) 
		const qrCodeBuffer = await qrcode.toBuffer(tfa.qrCode);
		res.set('Content-type', 'image/png');
		res.send(qrCodeBuffer);
	}
	

	@Get('verify/:token/:intraId')
	@UseGuards(AuthenticatedGuard)
	async verifyToken(@Param('token') token: string, @Param('intraId') intraId: string) {
		const user = await this.userService.findByintraIdEntitiy(intraId);
		const result = this.authService.verifyTwoFactorAuthentication(token, user.twoFactorAuthSecret);
		// console.log(result);
		await this.userService.updateTwoFactorStatus(user.id, true)
		if (result)
			return true
		return false
	}

}