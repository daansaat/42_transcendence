import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuthGuard extends AuthGuard('oauth') {
	async canActivate(context: ExecutionContext): Promise<any> {
		// console.log("oauthguard icinde");
		const request = context.switchToHttp().getRequest();
		// console.log("than request");
		const activate = (await super.canActivate(context)) as boolean;
		// console.log("oauthguard->login before")
		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		// console.log(" guard " + req.isAuthenticated())
		
		return req.isAuthenticated();
	}
}
