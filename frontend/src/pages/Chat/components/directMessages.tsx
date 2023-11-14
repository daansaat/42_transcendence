import { useState } from "react";
import { FormAddContact } from "./formAddContact";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType } from "../../../contexts";

export const DirectMessages = () => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
    const { setRoom, myRooms } = useChat();

    return (
        <>
			<div className="borderTop-small" />
            <h3>
                Direct Messages
                <button className="plusBtn" onClick={() => setPopupVisibility(true)}>
                    + 
                </button>
            </h3>
            <div className="dmSideBar">
            <ClickableList
                items={myRooms}
                renderItem={room => room.type === RoomType.DIRECTMESSAGE
                    ? (
                        <p className="roomList">
                            {room.contactName}
							{room.unreadMessages > 0 &&
								<span className="unread">
									{room.unreadMessages < 10
									? ` ${room.unreadMessages}`
									: ` 9+`
									}
								</span>
							}
                        </p>
                    ): <></>
                }
                onClickItem={room => setRoom(room)}
                />
            </div>
            {popupVisibility && (
                <div className="formBackdrop" onClick={() => setPopupVisibility(false)}>
                    <div className="user-popup" onClick={(e) => e.stopPropagation()}>
                        <FormAddContact setPopupVisibility={setPopupVisibility} />
                    </div>
                </div>
			)}
        </>
    )
}
