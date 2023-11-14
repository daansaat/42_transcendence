import { useEffect, useState } from "react";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { User, useUser } from "../../../contexts";
import { useSetupDmConversation } from "./hookSetupDm";
import { AiOutlineClose } from "react-icons/ai"

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddContact = ({ setPopupVisibility }: addContactProps) => {
	const [unknowContacts, setUnknownContacts] = useState<User[]>([]);
	const setupDmConversation = useSetupDmConversation();
	const { allUsers, myRooms } = useChat();
	const { user } = useUser();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(contact => !myRooms.some(room => room.contactName === contact.userName))
		.filter(contact => contact.userName !== user.userName)
		
		setUnknownContacts(filteredUsers);
	},[allUsers, myRooms, user.userName])

	const handleClick = async(newContact: User) => {
		await setupDmConversation(newContact);
		setPopupVisibility(false);
	}

	return (
		<>
			<h4 className="formTitle">
				Add Contact
			</h4>
			<button className="iconBtn formCloseBtn"
					type="button" 
					onClick={() => setPopupVisibility(false)}>
					<AiOutlineClose size="2em"/>
			</button>
			<ClickableList
				items={unknowContacts}
				renderItem={(newContact) => (
					<p className="user-row avatar-status-wrapper">
						<img src={newContact.avatar} alt="avatar" style={{margin:0,width:50, height:50, borderRadius:50}}/>
						{newContact.status === 'online' ?
						<span className="online-dot-big"></span> :
						<span className="offline-dot-big"></span>
						}
						{newContact.userName}
					</p>
				)}
				onClickItem={(newContact) => handleClick(newContact)}
			/>
		</>
	)
}
