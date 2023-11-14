import { Controller, Get, Req, Param, Delete, Put, UploadedFile, UseInterceptors, Post, Body, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { UserService } from '../user.service';
import { join } from 'path';

import * as fs from "fs";
import { FriendsService } from './friends.service';
import { UserI } from '../user.interface';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from 'src/auth/oauth/oauth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('friends')
export class FriendsController {
    constructor(private readonly userService: UserService,
        private readonly friendsService: FriendsService) { }

        @Get('allUsers')
        getAllUsers(): Promise<UserI[]>{
            return this.userService.findByAllUser();
        }
    
        @Get('allUser/:intraId')
        async getAllUser(@Param('intraId') intraId:string){
            const getUser = await this.userService.findByintraIdEntitiy(intraId)
            if(!getUser)
                return
            const users = await this.userService.findByAllUser()
            const friendsUser = await this.friendsService.getFriends(getUser.id)
            const friendsQuery = await this.friendsService.getFriendsQuery(getUser.id)
            const friendsSend = await this.friendsService.getMyFriendQuery(getUser.id);
            const friendsy1 = await this.friendsService.getFriends1(getUser.id)

            if(!friendsUser)
                return
            const allUsers = {friends:[], query:[], nonFriends:[], me:[]}            
          
            users.forEach((user) => {
                if(!user){}
                else if (friendsUser.map(friend=>friend.id).includes(user.id)) {
                    allUsers.friends.push(user);
                }
                else if (friendsy1.map(friend=>friend.id).includes(user.id)) {
                    allUsers.friends.push(user);
                }
                
                else if(user.id == getUser.id){
                    allUsers.me.push(user)
                }
                else if(friendsQuery.map(query => query.id).includes(user.id)){
                    allUsers.query.push(user)
                }
                else if(friendsSend && friendsSend.map(query => query.id).includes(user.id)){
                    allUsers.query.push(user)
                }
                else if(user.userName == "admin"){}
                else {
                    allUsers.nonFriends.push(user);
                }
              });
              return allUsers;
        }

    @Post('add/:myId/:friendId')
    async sendFriendRequest(
        @Req() req,
        @Param('myId')myIntraId:string,
    @Param('friendId') friendIntraId:string) {
        const friend = await this.userService.findByintraIdEntitiy(friendIntraId);
        const user = await this.userService.findByintraIdEntitiy(myIntraId);
        if(user.id != req.user.id){
            return;
        }
        if (user.id == friend.id) {
            return;
        }
        await this.friendsService.requestFriend(user, friend);
    }

    //get friends query
    @Get('getFriendQuery/:intraId')
    async getFriendQuery(@Param('intraId') intraId: string): Promise<UserI[]> {
        const user = await this.userService.findByintraIdEntitiy(intraId);
        if(!user)
            return null;
        return await this.friendsService.getMyFriendQuery(user.id);
    }

    @Post('/delete/:userIntraId/:friendIntraId')
    async deleteFriend(
        @Req() req,
        @Param('userIntraId') userIntraId:string,
        @Param('friendIntraId') friendIntraId:string
    ) : Promise<Boolean>{
    const friend = await this.userService.findByintraId(friendIntraId);
    const user = await this.userService.findByintraId(userIntraId);
    // console.log("user " + req.user.id + " friend " + friend.id + " my " + user.id)
    if(!friend || !user)
    return false;
    if(user.id != req.user.id){
        // console.log("ayni degil!" + user.id + " " + req.user.id)
        return false;
    }
    return await this.friendsService.deleteFriends(user, friend);

    }

    @Post('/friend-request/:myId/:friendId/:answer')
    async friendRequestAnswer(  
        @Req() req,
        @Param('myId') myIntraId: string,
        @Param('friendId') friendIntraId: string,
        @Param('answer') answer: string,):Promise<Boolean>{
    
    const friend = await this.userService.findByintraId(friendIntraId);
    const user = await this.userService.findByintraId(myIntraId);
    if(!friend || !user || answer === undefined)
    return false;
    if(user.id != req.user.id)
        return false;

    return await this.friendsService.friendRequestAnswer(user, friend,answer)
        
    }

}