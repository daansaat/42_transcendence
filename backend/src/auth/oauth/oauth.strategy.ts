import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: config.get("intraId"),
      clientSecret: config.get("secretKey"),
      callbackURL: 'http://f1r1s3.codam.nl:3001/auth/redirect',
    });

  }
  async validate(accessToken: string) {
    const data = await this.httpService
      .get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
    // console.log("Acces token " + accessToken)

    const user = await this.userService.findByintraId(data.data.id);
    if (user) {
      return user;
    }
    else {
      const intraId = data.data.id;
      const userName = null;
      const avatar = data.data.image.link;
      const avatarSmall = data.data.image.versions.micro
      const isLogged = true;
      const intraName = data.data.login;
      const validateUserDto = { intraId, userName, avatar, avatarSmall, isLogged, intraName };
      return await this.userService.createUser(validateUserDto);
    }
  }
}
