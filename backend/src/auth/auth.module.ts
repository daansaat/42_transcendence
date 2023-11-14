import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthStrategy } from './oauth/oauth.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { SessionSerializer } from './serializer';


@Module({
  imports: [
    HttpModule,
		JwtModule.register({}),
		forwardRef(() => UserModule),
		PassportModule.register({ session: true }),
  ],
  providers: [AuthService, OAuthStrategy, SessionSerializer], 
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
