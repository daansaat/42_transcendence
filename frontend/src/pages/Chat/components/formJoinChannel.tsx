import axios from "axios"
import { useEffect, useState } from "react"
import { Room, RoomType, UserRole } from "../../../contexts/ChatContext/types"
import { ClickableList } from "./clickableList"
import { useChat } from "../../../contexts/ChatContext/provider"
import { useUser } from "../../../contexts"
import { useSocket } from "../../../contexts/SocketContext"
import { AiOutlineLock, AiOutlineExclamationCircle, AiOutlineClose } from "react-icons/ai"

type Props = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormJoinChannel = ({ setPopupVisibility }: Props) => {
    const [joinableRooms, setJoinableRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [isProtected, setIsProtected] = useState<boolean>(false);
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const [value, setValue] = useState<string>('')
    const { setRoom, myRooms, setMyRooms, fetchPublicRooms, publicRooms, addRoomUser } = useChat();
    const { user } = useUser();
    const { socket, URL } = useSocket();
        
    useEffect(() => {
        fetchPublicRooms();
    }, [fetchPublicRooms])

    useEffect(() => {
        const getJoinableRooms = () => {
            const filteredRooms = publicRooms.filter(publicRoom => {
                const myRoom = myRooms.find(myRoom => myRoom.roomName === publicRoom.roomName);
                if (!myRoom) {
                    return true;
                } else {
                    return myRoom.isBanned;
                }
            });
            setJoinableRooms(filteredRooms);
        };
    	getJoinableRooms();
    },[publicRooms, myRooms])

    const joinRoom = async(room: Room) => {
        const newRoomUser = await addRoomUser({
            roomName: room.roomName, 
            userName: user.userName, 
            userRole: UserRole.MEMBER,
            contactName: null,
        });
        
        if (newRoomUser) {
            if (newRoomUser.isBanned) {
                setIsBanned(true);
                return
            } 
			setMyRooms(prev => [...prev, newRoomUser]);
            setRoom(newRoomUser);
            socket.emit('joinRoom', room.roomName);
        }
        setPopupVisibility(false);
    }

    const handleRoomListClick = (room: Room) => {
        if (room.type === RoomType.PROTECTED) {
            setSelectedRoom(room);
            setIsProtected(true);
        } else {
            joinRoom(room);
        }
    }

    const handlePasswordSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRoom) {
            const response = await axios.post(`${URL}/chat/password`, {
                roomName: selectedRoom.roomName,
                type: RoomType.PROTECTED,
                password: value
            }, {withCredentials:true})
            if (response.data === false) {
                alert('incorrect password, try again');
                setValue('');
            } else {
                joinRoom(selectedRoom);
            }
        }
    }

    return (
        <>
            {joinableRooms.length > 0 &&
            <>
                <h4 className="formTitle borderTop">
                Join Existing Channel

                </h4>
                <div className="roomJoinList">
                    <ClickableList
                        items={joinableRooms}
                        renderItem={room => 
                            <p className="roomList">
                            {room.roomName} {room.type === RoomType.PROTECTED ? <AiOutlineLock /> : null}
                            </p>}
                        onClickItem={room => handleRoomListClick(room)}
                    />
                </div>
                <div>
                    {isProtected && 
                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                placeholder="Enter Password"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                />
                            <button className="formBtn" >JOIN</button>
                        </form>
                    }
                    {isBanned &&
                    <div className="banned-popup">
                        <AiOutlineExclamationCircle size="6em" color="red"/>
                        <div className="banned-popup-text">
                            You Are Banned From This Channel
                            <button className="iconBtn formCloseBtn" onClick={() => setIsBanned(false)}>
                                <AiOutlineClose size="2em"/>
                            </button>
                        </div>
                    </div>
                    }
                </div>
            </>
            }
        </>
    )
}
