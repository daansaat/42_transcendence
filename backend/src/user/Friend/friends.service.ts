import { Injectable } from '@nestjs/common';
import { UserI } from '../user.interface'
import * as speakeasy from 'speakeasy';
import { UserEntity } from 'src/typeorm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { use } from 'passport';
import { ACHIEVEMENTSEntity } from 'src/typeorm/achievements.entity';
import { AchievementsDto } from '../achievements.dto';
import { UserService } from '../user.service';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly userService: UserService
    ) { }


    async getCombinedFriends(userId: number): Promise<UserI[]> {
        const myFriends = await this.getMyFriendQuery(userId);
        const friends = await this.getFriendsQuery(userId);
    
        const combinedFriends = [...myFriends, ...friends];
        return combinedFriends;
    }

    async requestFriend(user: UserI, friend: UserI) {
        //first get before query
        user.requestedFriends = await this.getCombinedFriends(user.id);

        //check is it undefined or not
        if (user.requestedFriends === undefined)
            user.requestedFriends = [];



        const index = user.requestedFriends.findIndex((getFriend) => getFriend.id === friend.id);
        //delete requestarray
        if (index !== -1) {

        }
        else {
         
                user.requestedFriends = [...user.requestedFriends, friend];
                await this.userRepository.save(user)

        }














    }


    async deleteFriends(user: UserI, friend: UserI): Promise<Boolean> {
        user.friends = await this.getFriends(user.id)
        if (user.friends === undefined) {
            // console.log("undefined")
            return false;
        }
        // console.log("user=>friend " + user.friends)
        const index = user.friends.findIndex((getFriend) => getFriend.id === friend.id);
        //delete requestarray
        if (index !== -1) {
            user.friends.splice(index, 1);
            await this.userRepository.save(user);
        }
        else {
            user.friends = await this.getFriends1(user.id)


            if (user.friends === undefined) {
                // console.log("undefined1")
                return false;
            }
            // console.log("user=>friend " + user.friends)
            const index11 = user.friends.findIndex((getFriend) => getFriend.id === friend.id);
            //delete requestarray
            if (index11 !== -1) {
                user.friends.splice(index, 1);
                await this.userRepository.save(user);
            }
            else {
                // console.log("index problem")
                return false;
            }
        }


        friend.friends = await this.getFriends(friend.id)
        // console.log("friend=>user " + friend.friends)

        if (friend.friends === undefined) {
            // console.log("friends undefined")
            return false;
        }
        const index1 = friend.friends.findIndex((getFriend) => getFriend.id === user.id);
        //delete requestarray
        if (index1 !== -1) {
            friend.friends.splice(index, 1);
            await this.userRepository.save(friend);
        }
        else {


            friend.friends = await this.getFriends1(friend.id)
            // console.log("friend=>user1 " + friend.friends)

            if (friend.friends === undefined) {
                // console.log("friends undefined1")
                return false;
            }
            const index112 = friend.friends.findIndex((getFriend) => getFriend.id === user.id);
            //delete requestarray
            if (index112 !== -1) {
                friend.friends.splice(index, 1);
                await this.userRepository.save(friend);
            }
            else {
                // console.log("friend index")
                return false;
            }
        }
        return true;
    }

    async friendRequestAnswer(user: UserI, friend: UserI, answer: string): Promise<Boolean> {
        friend.requestedFriends = await this.getFriendsQuery(friend.id)
        const index = friend.requestedFriends.findIndex((getUser) => getUser.id === user.id);
        if (index !== -1) {
            friend.requestedFriends.splice(index, 1);
            await this.userRepository.save(friend);
        }
        else {
            return false;
        }

        if (answer === "true") {
            user.friends = await this.getFriends(user.id)
            if (user.friends === undefined) {
                user.friends = [];
                // console.log("user frind undefined!")
                this.userService.setAchievements(user.intraId, "SOCIAL_BUTTERFLY")
            }
            if (user.friends.length == 0)
                this.userService.setAchievements(user.intraId, "SOCIAL_BUTTERFLY")

            friend.friends = await this.getFriends(friend.id)

            // console.log(user.friends)
            // console.log(friend.friends)
            if (friend.friends.length == 0)
                this.userService.setAchievements(friend.intraId, "SOCIAL_BUTTERFLY")
            user.friends.push(friend)
            await this.userRepository.save(user)

            return true;
        }
        else {
            return true;
        }
    }

    async getFriends(userId: number): Promise<UserI[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.friends', 'friends')
            .where('user.id = :id1', { id1: userId })
            .getOne();
        return user.friends;
    }
    async getFriends1(userId: number): Promise<UserEntity[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.friends', 'friends')
            .where('friends.id = :id1', { id1: userId })
            .getMany();
        return user;
    }



    async getMyFriendQuery(userId: number): Promise<UserEntity[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.requestedFriends', 'requested')
            .where('requested.id = :userId_1', { userId_1: userId })
            .getMany();
        return user;
    }

    async getFriendsQuery(userId: number): Promise<UserI[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.requestedFriends', 'requested')
            .andWhere('user.id = :senderIds', { senderIds: userId })
            .getOne();

        return user.requestedFriends;
    }




}

