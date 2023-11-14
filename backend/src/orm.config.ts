//with docker-compose
import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from '@nestjs/config';

export const config: TypeOrmModuleOptions = {
	type:'postgres',
	username:'postgres',
	password: 'postgres',
	port: 5432,
	host:'db',
	database:'postgres',
	synchronize: true, //companies(id, name, city, location) //if we add location later it will automatically create tables into the database
	entities:["dist/**/*.entity{.ts,.js}"]
};


//just backend
// import {TypeOrmModuleOptions} from '@nestjs/typeorm'
// export const config: TypeOrmModuleOptions = {
//     type: 'postgres',
//     userName: 'postgres',
//     password: '1234',
//     port : 5432,
//     host: '127.0.0.1',
//     database: 'example2',
//     synchronize: true,
//     entities: ['dist/**/*.entity{.ts,.js}'],

// }