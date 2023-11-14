import { useState } from "react"
import { RoomType, UserRole } from "../../../contexts/ChatContext/types";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";
import { useSocket } from "../../../contexts/SocketContext";
import { AiOutlineClose } from "react-icons/ai"


type createChannelProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormCreateChannel = ({ setPopupVisibility }: createChannelProps) => {
	const [type, setType] = useState<RoomType>(RoomType.PUBLIC);
	const [roomName, setRoomName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { setRoom, createNewRoom, addRoomUser, setMyRooms } = useChat();
	const { user } = useUser();
	const { socket } = useSocket();

	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			await createNewRoom({
				roomName: roomName,
				type: type,
				password: password,
			});
	
			const newRoomUser = await addRoomUser({
				roomName: roomName, 
				userName: user.userName, 
				userRole: UserRole.OWNER,
				contactName: null,
			});
	
			if (newRoomUser) {
				setMyRooms(prev => [...prev, newRoomUser])
				setRoom(newRoomUser);
				socket.emit('joinRoom', roomName);
			};
	
			setPopupVisibility(false);
		} catch (error: any) {
      alert(error.response.data.message);
		}
	}
	
	return (
		<>
			<form onSubmit={handleSubmit}>
				<h4 className="formTitle">
					Create New Channel 
					</h4>
				<button className="iconBtn formCloseBtn"
					type="button" 
					onClick={() => setPopupVisibility(false)}>
					<AiOutlineClose size="2em"/>
				</button>
				<div>
					<p>
					Select Type
					<select className="form-input" value={type} onChange={(e) => setType(e.target.value as RoomType)}>
						<option value={RoomType.PUBLIC}>public</option>
						<option value={RoomType.PRIVATE}>private</option>
						<option value={RoomType.PROTECTED}>protected</option>
					</select>
					</p>
				</div>
				<div >
					<p>
						Channel Name
					<input
						required
						placeholder="Enter Name" 
						value={roomName}
						maxLength={25}
						onChange={(e) => setRoomName(e.target.value.trim())}
						/> 
					</p>
				</div>
				{type === 'protected' && (
					<div>
						<p>
						Password
						<input 
							required
							placeholder="Enter Password"
							value={password}
							maxLength={25}
							onChange={(e) => setPassword(e.target.value.trim())}
						/>
						</p>
					</div>
				)}
				<button className="formBtn" type="submit">
					CREATE
				</button>
			</form>
		</>
	)
}
