import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {config} from './orm.config'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';

import { MulterModule } from '@nestjs/platform-express';
import { GatewayModule } from './gateway/gateway.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';


@Module({
  imports: [TypeOrmModule.forRoot(config), 
            PassportModule.register({session:true}), 
            UserModule,  AuthModule, GatewayModule, ChatModule,
            GameModule,
		        ConfigModule.forRoot({ isGlobal: true }),
            MulterModule.register({
              dest: './upload',
            }),
        ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
