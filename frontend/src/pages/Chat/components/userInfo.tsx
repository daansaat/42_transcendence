import { useChat } from "../../../contexts/ChatContext/provider";
import { Member, RoomType } from "../../../contexts/ChatContext/types";
import { useUser } from "../../../contexts";
import { useSetupDmConversation } from "./hookSetupDm";
import { BlockButton } from "./buttonBlock";
import { useEffect } from "react";
import { MdKeyboardReturn } from "react-icons/md"
import { BsChatRightText } from "react-icons/bs"
import { PiGameControllerDuotone } from "react-icons/pi"
import { CgProfile } from "react-icons/cg"
import { Link } from "react-router-dom";

type Props = {
  selectedMember: Member | null,
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const UserInfo = ({ selectedMember, setSelectedMember }: Props) => {
  const { user } = useUser();
	const { myRooms, room, setRoom, members } = useChat();
	const setupDmConversation = useSetupDmConversation();

	const openConversation = async(member: Member) => {
		const existingRoom = myRooms.find(room => room.contactName === member.userName);
		if (existingRoom) {
			setRoom(existingRoom);
		} else {
			await setupDmConversation(member);
		}
	}

	useEffect(() => {
		if (room.type === RoomType.DIRECTMESSAGE) {
			const contact = members.find(member => member.userName !== user.userName);
			if (contact) {
				setSelectedMember(contact);
			} else {
				setSelectedMember(null);
			}
		}
	}, [members, room, user, setSelectedMember])

	return (
		<>
			{room.type !== RoomType.DIRECTMESSAGE &&
        <button className="iconBtn" onClick={() => setSelectedMember(null)}>
					<MdKeyboardReturn size="2em"/>
				</button>
			}
			{selectedMember && 
			selectedMember.userName !== user.userName ?
				<h2 className="borderTop">
					{selectedMember?.userName}
					<div className={selectedMember?.status === 'online' ? ' onlineDot' : ' offlineDot'}></div>
				</h2>
				: <h2 className="borderTop">Me</h2>
			}
			<div className="userInfo">
				<div>
					{selectedMember &&
					<img src={selectedMember.avatar} alt="avatar" style={{margin:10,width:240, height:190, borderRadius:10}}/>
					}
				</div>
				<div className="borderTop-small" />
				<div>
					{selectedMember && 
					selectedMember.userName !== user.userName &&
						<h2 style={{ display: 'inline' }}>
							<BlockButton member={selectedMember}/>
						</h2>
					}

					{selectedMember 
						&& selectedMember.userName !== user.userName 
						&& room.type !== RoomType.DIRECTMESSAGE 
						&& 
						<>
							<button className="iconBtn" onClick={() => openConversation(selectedMember)}>
							<BsChatRightText size="3em"/>
							</button>
						</>
					}
					{selectedMember 
						&& selectedMember.userName !== user.userName 
						&& 
						<>
							<Link to={{ pathname: '/waitingreply', search: `?username=${selectedMember.userName}`}} className="iconBtn" >
								<PiGameControllerDuotone size="3em" />
							</Link>
							<Link to={`/profile/${selectedMember.userName}`} className="iconBtn">
								<CgProfile size="3em"/>
							</Link>
							</>
					}
				</div>
			</div>
		</>
	)
}
