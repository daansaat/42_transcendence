import { ACHIEVEMENTSEntity } from "src/typeorm/achievements.entity";

export interface UserI {
	id?: number;
	intraId?: string;
	userName?: string;
	avatar?: string;
	avatarSmall?: string;
	friends?: UserI[];
	requestedFriends?: UserI[];
}
