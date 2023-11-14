import { useState } from "react"
import { FormCreateChannel } from "./formCreateChannel";
import { FormJoinChannel } from "./formJoinChannel";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType } from "../../../contexts";

export const Channels = () => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
	const { setRoom, myRooms } = useChat();
	
	return (
		<>
			<h3>
				Channels
				<button className="plusBtn" onClick={() => setPopupVisibility(true)}>
					+
				</button>
			</h3>
			<div className="channelSideBar">
				<ClickableList
					items={myRooms}
					renderItem={room => (
						room.type !== RoomType.DIRECTMESSAGE &&
						!room.isBanned && !room.isKicked)
						? (
							<p className="roomList">
								{room.roomName}
								{room.unreadMessages > 0 &&
									<span className="unread">
										{room.unreadMessages < 10
										? ` ${room.unreadMessages}`
										: ` 9+`
										}
									</span>
								}
							</p>
						)
						: <></>
					}
					onClickItem={room => setRoom(room)}
				/>
			</div>
			{popupVisibility && (
				<div className="formBackdrop" onClick={() => setPopupVisibility(false)}>
					<div className="channel-popup" onClick={(e) => e.stopPropagation()}>
							<FormCreateChannel
								setPopupVisibility={setPopupVisibility}
							/>
							<FormJoinChannel
								setPopupVisibility={setPopupVisibility}
							/>
					</div>
				</div>
			)}
		</>
	)
}
