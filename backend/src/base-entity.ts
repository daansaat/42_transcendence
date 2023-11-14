import { PrimaryGeneratedColumn} from "typeorm";

export class BaseEntity{
    @PrimaryGeneratedColumn()
    user_id?: number;

}