import './styles.css'
import { MessageInput } from "./components/messageInput";
import { MessageWindow } from "./components/messageWindow";
import { RoomInfo } from "./components/roomInfo";
import { ChatHeader } from "./components/chatHeader";
import { useState } from "react";
import { Channels } from "./components/channels";
import { DirectMessages } from "./components/directMessages";
import { UserInfo } from "./components/userInfo";
import { Member, RoomType } from '../../contexts/ChatContext/types';
import { useChat } from '../../contexts/ChatContext/provider';
import { useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai"

export const Chat = () => {
	const [expanded, setExpanded] = useState<boolean>(true);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const { room } = useChat();

	useEffect(() => {
		setSelectedMember(null);
	}, [room])

	return (
		<>
		{/* <div className="chat-container"> */}
			<div id={expanded ? "chat-grid-expanded" : "chat-grid-non-expanded"}>
				<div id="chat-left-sidebar">
					<Channels />
					<DirectMessages />
				</div>
				<div id="chat-body">
					<ChatHeader 
						expanded={ expanded }
						setExpanded={ setExpanded }
					/>
					<MessageWindow />
					<MessageInput />
				</div>
				{expanded &&
					<div id="chat-right-sidebar">
						<button className='iconBtn' onClick={() => setExpanded(false)}>
							<AiOutlineClose size="1.5em" />
						</button>
						{room.type === RoomType.DIRECTMESSAGE || selectedMember ? 
							<UserInfo
								selectedMember={selectedMember}
								setSelectedMember={setSelectedMember} 
							/> 
							: 
							<RoomInfo setSelectedMember={setSelectedMember} /> }
					</div>
				}
			</div>
			{/* </div> */}
		</>
	)
}
