import { RoomUser, GENERAL_CHAT, RoomType } from "../../../contexts/ChatContext/types";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";


type Props = {
	expanded: boolean,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatHeader = ({ expanded, setExpanded }: Props) => {
	const { user } = useUser();
	const { room, removeRoomUser } = useChat();

	function isDmRoomUser(room: RoomUser) {
		return room.type === RoomType.DIRECTMESSAGE;
	};
	
	return (
		<div id="chat-header">
			<button className="roomBtn" onClick={() => setExpanded(!expanded)}>
				{isDmRoomUser(room) ? room.contactName : `${room.roomName}`}
			</button>
			{room.roomName !== GENERAL_CHAT.roomName ?
				<button className="leaveChat-btn" onClick={() => removeRoomUser(room.roomName, user.userName, user.intraId)}>
					{room.type !== RoomType.DIRECTMESSAGE ? "LEAVE CHANNEL" : "LEAVE CONVERSATION"}
				</button>
				: null
			}
		</div>
	)
}
