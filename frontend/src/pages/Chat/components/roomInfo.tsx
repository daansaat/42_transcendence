import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { BlockButton } from "./buttonBlock";
import { AdminButton } from "./buttonAdmin";
import { useState } from "react";
import { FormAddMember } from "./formAddMember";
import { Member, UserRole } from "../../../contexts/ChatContext/types";
import { BanButton } from "./buttonBan";
import { KickButton } from "./buttonKick";
import { MuteButton } from "./buttonMute";
import { FormEditPassword } from "./formEditPassword";
import { useUser } from "../../../contexts";
import { AiOutlineUserAdd } from "react-icons/ai";

type Props = {
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const RoomInfo = ({ setSelectedMember }: Props) => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
	const { user } = useUser();
	const { members, room } = useChat();
	
	const handleMemberClick = (member: Member) => {
		setSelectedMember(member);
	}

	return (
		<>
			{room.userRole === UserRole.OWNER &&
				<div className="borderTop">
				<FormEditPassword />
				</div>
			}
		<div>
			{room.userRole === UserRole.ADMIN &&
			<div className="borderTop" />
			}
			{(room.userRole === UserRole.OWNER ||
				room.userRole === UserRole.ADMIN) &&
				<button className="iconBtn" onClick={() => setPopupVisibility(!popupVisibility)}>
					<AiOutlineUserAdd size="2em" color="green"/>
					invite
				</button>
			}
			<h4 className="borderTop">
				Members
			</h4>
			{popupVisibility &&
				<FormAddMember setPopupVisibility={setPopupVisibility} />
			}
			<ClickableList
				items={members}
				renderItem={(member) => (
					!member.isBanned ?
						<div className="memberList">
							<div>
								{member.userName !== user.userName &&
									<BlockButton member={member} /> 
								}
							</div>
							<div className="membersList">
								<img 
									src={member.avatar} 
									alt="avatar" 
									className={`avatar-small ${member.status === 'online' ? 'online' : 'offline'}`}
								/> 
								{member.userName}
							</div >
							<div>
								{room.userRole === UserRole.OWNER && 
									member.userRole !== UserRole.ADMIN &&
									member.userName !== user.userName && 
									<AdminButton member={member}/>
								}
								{(room.userRole === UserRole.OWNER || 
									(room.userRole === UserRole.ADMIN &&
									member.userRole !== UserRole.OWNER)) &&
									member.userName !== user.userName &&
									<>
										<BanButton member={member} />
										<KickButton member={member} />
										<MuteButton member={member} />
									</>
								}
							</div>
							<div className={`${member.userRole === UserRole.OWNER ? 'owner' 
								: member.userRole === UserRole.ADMIN ? 'admin' : ''}`}>
								{member.userRole === UserRole.OWNER ||
									member.userRole === UserRole.ADMIN 
									? member.userRole
									: null	
								}
							</div>
						</div>
					: <></>
				)}
				onClickItem={(member) => handleMemberClick(member)}
				/>
			</div>

			<div>
			{(room.userRole === UserRole.OWNER || room.userRole === UserRole.ADMIN) &&
				members.some(member => member.isBanned) &&
				<>
					<h5 className="borderTop">
						Banned
					</h5>
					<ClickableList
						items={members}
						renderItem={(member) => (
							member.isBanned ?
								<div className="memberList">
									<BlockButton member={member} />
									<div className="avatar-status-wrapper">
										<img 
											src={member.avatar} 
											alt="avatar" 
											className={`avatar-small ${member.status === 'online' ? 'online' : 'offline'}`}
										/> 
										{member.userName}
									</div>
									<BanButton member={member}/>
								</div>
							: <></>
						)}
						onClickItem={(member) => handleMemberClick(member)}
					/>
				</>
			}	
			</div>
		</>
	)
}
