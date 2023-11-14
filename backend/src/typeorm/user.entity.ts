import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { GameEntity } from "./game.entity";
import { MessageEntity } from "./message.entity";
import { RoomUserEntity } from "./roomUser.entity";
import {ACHIEVEMENTSEntity} from './achievements.entity'
export const ADMIN = 'admin';


@Entity()
@Unique(['userName'])
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique:true, nullable:true})
	userName: string;

	@Column({ name: 'intraId',nullable: true, unique: true })
  	intraId: string;

	@Column({ name: 'intraName',nullable: true, unique: true })
  	intraName: string;
 	
	@Column({nullable: true })
	public avatar: string;


	@Column({ nullable: true })
	status: string;


	@Column({})
	isLogged: boolean = false;

	@Column({default:false})
	TwoFactorAuth:boolean = false

	@Column({nullable: true})
	twoFactorAuthSecret:string


	@ManyToMany(() => UserEntity)
	@JoinTable({ joinColumn: { name: 'sender_id' } })
	requestedFriends: UserEntity[];

	@ManyToMany(() => UserEntity, { cascade: true })
	@JoinTable({ joinColumn: { name: 'userId_1' } })
	friends: UserEntity[];

	@OneToMany(() => MessageEntity, message => message.user)
	messages: MessageEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.user)
	roomLinks: RoomUserEntity[];

	
	@OneToMany(() => ACHIEVEMENTSEntity, (achievements) => achievements.user)
	achievements: ACHIEVEMENTSEntity;

    @Column({
        default: 0
    })
    score: number;

	@Column({
        default: 0
    })
    totalWin: number;

	@Column({
        default: 0
    })
    totalLoose: number;


	@Column({
        default: 0
    })
    rank: number;

	@Column({})
	inGame: boolean = false;


  


	@OneToMany(() => RoomUserEntity, roomUser => roomUser.contact)
	contactLinks: RoomUserEntity[];

	@ManyToMany(() => UserEntity, user => user.blockedBy)
	@JoinTable({ name: "block" })
	blocking: UserEntity[];
	
	@ManyToMany(() => UserEntity, user => user.blocking)
	blockedBy: UserEntity[];

  	@JoinTable()
    @OneToMany(() => GameEntity, game => game.player)
    games: GameEntity[];
  



}