import { useEffect, useState } from "react";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { User, UserRole, useUser } from "../../../contexts";
import { AiOutlineClose } from "react-icons/ai"
import { ClickableList } from "./clickableList";
import { AiOutlineCheck } from "react-icons/ai"

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddMember = ({ setPopupVisibility }: addContactProps) => {
	const [unknowMembers, setUnknownMembers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const { allUsers, members, addRoomUser } = useChat();
	const { socket } = useSocket();
	const { user } = useUser();
	const { room } = useChat();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(users => !members.some(member => member.userName === users.userName))
		.filter(users => users.userName !== user.userName)
		
		setUnknownMembers(filteredUsers);
	},[allUsers, members, user.userName])

	const isSelected = (user: User) => {
		return selectedUsers.some(selectedUser => selectedUser.userName === user.userName)
	}

	const handleSelectChange = (user: User ) => {
		if (isSelected(user)) {
			setSelectedUsers(prev => prev.filter(selectedUser => selectedUser.userName !== user.userName))
		} else {
			setSelectedUsers(prev => [...prev, user])
		}	};

  const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		
		for (const selectedUser of selectedUsers) {
			const newRoomUser = await addRoomUser({
				roomName: room.roomName,
				userName: selectedUser.userName,
				userRole: UserRole.MEMBER,
				contactName: null,
			});

			socket.emit('roomInvite', {
				...newRoomUser,
				intraId: selectedUser.intraId, 
			});
		};
		
		setPopupVisibility(false);
  }

	return (
		<div className="formBackdrop" onClick={() => setPopupVisibility(false)}>
		<form className="user-popup" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
			<h4 className="formTitle">
				Invite Member
			</h4>
			<button className="iconBtn formCloseBtn"
					type="button" 
					onClick={() => setPopupVisibility(false)}>
					<AiOutlineClose size="2em"/>
			</button>
			<ClickableList
				items={unknowMembers}
				renderItem={ user =>
					<p>
						<label className={`user-row avatar-status-wrapper ${isSelected(user) ? 'selected' : ''}`}>
							<img src={user.avatar} alt="avatar" style={{margin:0,width:50, height:50, borderRadius:50}}/>
							{user.status === 'online' ?
							<span className="online-dot-big"></span> :
							<span className="offline-dot-big"></span>
							}
							{user.userName}
							{isSelected(user) ? <AiOutlineCheck color="green" /> : null}
						</label>
					</p>
				}
				onClickItem={user => handleSelectChange(user)}
			/>
			<div>
				<button className="formBtn" type="submit">
					ADD
				</button>
			</div>
		</form>
		</div>
	)
}
