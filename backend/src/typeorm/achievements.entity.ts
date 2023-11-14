import { Column, Entity, PrimaryGeneratedColumn,ManyToOne, JoinColumn } from "typeorm"
import {UserEntity} from './user.entity'



@Entity()
export class ACHIEVEMENTSEntity{

	@PrimaryGeneratedColumn()
	id: number;


    @Column({default:true})
	FRESH_PADDLE:boolean = true


        @Column({default:false})
	FIRST_VICTORY:boolean = false


        @Column({default:false})
	PONG_WHISPERER:boolean = false


        @Column({default:false})
	CHATTERBOX:boolean = false


        @Column({default:false})
	SOCIAL_BUTTERFLY:boolean = false


        @Column({default:false})
	CHAMELEON_PLAYER:boolean = false

        @Column({default:false})
	FRIENDLY_RIVALRY:boolean = false


        @Column({default:false})
	EPIC_FAIL:boolean = false


	@ManyToOne(() => UserEntity, (user) => user.achievements)
	@JoinColumn({name:'userId'})
	user: UserEntity;

}
