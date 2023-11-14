import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as dotenv from 'dotenv';
import { ChatService } from './chat/chat.service';
import { UserService } from './user/user.service';


import { ConfigService } from '@nestjs/config';

import { Express } from 'express';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {

  dotenv.config();
  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://f1r1s3.codam.nl:3000'],
    credentials: true,
  });


	const configService = app.get(ConfigService);
	app.use(
		session({
			cookie: {
				maxAge: 6000 * 60 * 24, // login cookie is 24 hours valid
			},
			secret: configService.get("secretKey"),
			resave: false,
			saveUninitialized: false,
		}),
	);

  const passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  })); 

  await app.listen(3000);
  const chatService = app.get(ChatService);
  await chatService.initializeGeneralChatRoom();

  }
bootstrap();
