import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../typeorm/user.entity";
import { RoomEntity } from "./room.entity";

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}

@Entity()
export class RoomUserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userRole: UserRole;

    @Column({ default: 0 })
    unreadMessages: number;

    @Column({ default: false })
    isBanned: boolean;
    
    @Column({ default: false })
    isKicked: boolean;
    
    @Column({ default: false })
    isMuted: boolean;

    @Column({ nullable: true })
    muteEndTime: Date;

    @ManyToOne(() => UserEntity, user => user.roomLinks, {onDelete: 'CASCADE'})
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.userLinks, {onDelete: 'CASCADE'})
    room: RoomEntity;

    @ManyToOne(() => UserEntity, user => user.contactLinks, { nullable: true })
    contact: UserEntity;
}
