import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import axios from "axios";
import { GENERAL_CHAT, Member, Message, NewRoomUser, Room, RoomUser } from "./types";
import { useSocket } from "../SocketContext/provider";
import { User, useUser } from "../UserContext";
import { AchievementType } from "../../AchievementsEnum";

export type ChatContextValue = {
    room: RoomUser,
    myRooms: RoomUser[],
    publicRooms: Room[],
    blocked: User[],
    messages: Message[],
    allUsers: User[],
    members: Member[],
    setRoom: React.Dispatch<React.SetStateAction<RoomUser>>,
    setMyRooms:  React.Dispatch<React.SetStateAction<RoomUser[]>>,
    setBlocked: React.Dispatch<React.SetStateAction<User[]>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    fetchPublicRooms: () => Promise<void>,
    createNewRoom: (newRoom: Room) => Promise<void>,
    addRoomUser: (newRoomUser: NewRoomUser) => Promise<RoomUser | undefined>,
    removeRoomUser: (roomName: string, userName: string, intraId: string) => Promise<void>,
    updateRoomUser: (updatedRoomUser: Member, roomName: string) => Promise<void>,
    updateRoom: (updatedRoom: Room) => Promise<void>,
    handleBlock: (member: User, blockAction: string) => Promise<void>,
    setAchievement: () => Promise<void>,
};

const ChatContext = createContext({} as ChatContextValue);

export function useChat() {
	return useContext(ChatContext);
}

export function ChatProvider({ children }: {children: ReactNode}) {
	const [room, setRoom] = useState<RoomUser>(GENERAL_CHAT);
    const [myRooms, setMyRooms] = useState<RoomUser[]>([]);
    const [publicRooms, setPublicRooms] = useState<Room[]>([]);
    const [members, setMembers] = useState<Member[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [blocked, setBlocked] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useUser();
    const { URL, socket } = useSocket();

    useEffect(() => {	
        if (user.userName === "unknown") {
            return
        } 
        const fetchMyRooms = async() => {
            try {
                const response = await axios.get(`${URL}/chat/myRooms/${user.userName}`, {withCredentials:true});
                setMyRooms(response.data);
                for (const room of response.data) {
                    socket.emit('joinRoom', room.roomName);
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        const fetchBlocked = async() => {
            try {
                const response = await axios.get(`${URL}/chat/blocked/${user.userName}`, {withCredentials:true});
                setBlocked(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        function onRoomInvite(newRoomUser: RoomUser) {
            setMyRooms(prev => [...prev, newRoomUser]);
            socket.emit('joinRoom', newRoomUser.roomName);
        };
        
        fetchMyRooms();
        fetchBlocked();

        socket.on('onRoomInvite', onRoomInvite);
        socket.emit('userUpdate');

        return () => {
            socket.off('onRoomInvite');
        }
    }, [user, socket, URL]);

    
    useEffect(() => {
        const clearUnreadMessages = async() => {
            room.unreadMessages = 0;
            try {
                axios.put(`${URL}/chat/updateRoomUser/`, {
                    ...user, 
                    ...room,
                    unreadMessages: 0,
                }, {withCredentials:true});
            } catch (error: any) {
                console.log(error);
            }
        };

        const fetchMembers = async() => {
            try {
                const response = await axios.get(`${URL}/chat/members/${room?.roomName}`, {withCredentials:true});
                response.data.sort((a: Member, b: Member) => a.userName.localeCompare(b.userName));
                setMembers(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        function onUserUpdate(users: User[]) {
            users.sort((a, b) =>  a.userName.localeCompare(b.userName));
            setAllUsers(users);
            socket.emit('memberUpdate', room.roomName);
        };
        
        function onMemberUpdate(roomName: string) {
            if (roomName === room.roomName) {
                fetchMembers();
            }
        };
        
        const fetchMessages = async() => {
            try {
                const response = await axios.get(`${URL}/chat/messages/${room?.roomName}`, {withCredentials:true});
                const filteredOnBlocked = response.data
                    .filter((message: Message) => !blocked.some(blocked => blocked.userName === message.userName));
                setMessages(filteredOnBlocked);
            } catch (error) {
                console.log(error);
            }
        };
            
        clearUnreadMessages();
        fetchMembers();
        fetchMessages();

        socket.on('onUserUpdate', onUserUpdate);
        socket.on('onMemberUpdate', onMemberUpdate);

        return () => {
            socket.off('onUserUpdate');
            socket.off('onMemberUpdate');
        }
    }, [user, socket, URL, room, blocked])

    useEffect(() => {
        function onRoomUpdate(roomUpdate: Room) {
            if (roomUpdate.roomName === room.roomName) {
                setRoom({...room, ...roomUpdate});
            }
            setMyRooms(prevRooms => {
                return prevRooms.map(room => {
                    if (room.roomName === roomUpdate.roomName) {
                        return {...room, ...roomUpdate};
                    } else {
                        return room;
                    }
                })
            })
        };

        function onRoomUserUpdate(updatedRoomUser: RoomUser) {
            if (updatedRoomUser.roomName === room.roomName) {
                if (updatedRoomUser.isBanned) {
                    setRoom(GENERAL_CHAT);
                } else {
                    setRoom(updatedRoomUser);
                }
            }
            setMyRooms(prevRooms => {
                return prevRooms.map(room => {
                    if (room.roomName === updatedRoomUser.roomName) {
                        return updatedRoomUser;
                    } else {
                        return room;
                    }
                })
            })
        };

        function onRemoveRoomUser(roomName: string) {
            setMyRooms(prevRooms => {
                return prevRooms.filter(room => room.roomName !== roomName)
            });
            if (roomName === room.roomName) {
                setRoom(GENERAL_CHAT);
            }
            socket.emit('leaveRoom', roomName);
        }

        socket.on('onRoomUpdate', onRoomUpdate);
        socket.on('onRoomUserUpdate', onRoomUserUpdate);
        socket.on('onRemoveRoomUser', onRemoveRoomUser);

        return () => {
            socket.off('onRoomUpdate');
            socket.off('onRoomUserUpdate');
            socket.off('onRemoveRoomUser');
        }
    }, [socket, room, myRooms])


    const fetchPublicRooms = async() => {
        try {
            const response = await axios.get(`${URL}/chat/publicRooms`, {withCredentials:true});
            setPublicRooms(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    const createNewRoom = async(newRoom: Room) => {
        try {
            await axios.post(`${URL}/chat/newRoom`, newRoom, {withCredentials:true});
        } catch (error: any) {
            throw (error);
        }
    }
    
    const addRoomUser = async(newRoomUser: NewRoomUser) => {
        try {
            const response = await axios.post(`${URL}/chat/addRoomUser/`, newRoomUser, {withCredentials:true});
            socket.emit('memberUpdate', room.roomName);
            return response.data as RoomUser;
        } catch (error: any) {
            console.log(error);
        }
    }
    
    const updateRoomUser = async(updatedMember: Member, roomName: string) => {
        try {
            const response = await axios.put(`${URL}/chat/updateRoomUser/`, {
                ...updatedMember, 
                roomName
            }, {withCredentials:true});
            socket.emit('roomUserUpdate', {
                ...response.data,
                intraId: updatedMember.intraId,
            });
        } catch (error: any) {
            console.log(error);
        }
    };

    const removeRoomUser = async(roomName: string, userName: string, intraId: string) => {
        try {
            await axios.put(`${URL}/chat/removeRoomUser/${roomName}/${userName}`, null, {withCredentials:true});
            socket.emit('memberUpdate', room.roomName);
            socket.emit('removeRoomUser', {
                roomName,
                intraId,
            });
        } catch (error: any) {
            console.log(error)
        }
    }

    const updateRoom = async(updatedRoom: Room) => {
        try {
            const response = await axios.put(`${URL}/chat/updateRoom`, updatedRoom, {withCredentials:true});
            const { roomId, roomName, type } = response.data;
            socket.emit('roomUpdate', {
                roomId,
                roomName,
                type,
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleBlock = async(member: User, blockAction: string) => {
        try {
            const response = await axios.put(`${URL}/chat/${blockAction}/${user.userName}/${member.userName}`, null, {withCredentials:true});
            setBlocked(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const setAchievement = async() => {
        try {
            await axios.post(`${URL}/user/setAchievements/${user.intraId}/${AchievementType.CHATTERBOX}`,
                null,{withCredentials:true});
        } catch (error) {
            console.log(error);
        }
    }

	const value = {
        room,
        myRooms,
        publicRooms,
        blocked,
        messages,
        allUsers,
        members,
        setRoom,
        setMyRooms,
        setBlocked,
        setMessages,
        fetchPublicRooms,
        createNewRoom,
        addRoomUser,
        removeRoomUser,
        updateRoomUser,
        updateRoom,
        handleBlock,
        setAchievement,
	};
    
	return (
        <ChatContext.Provider value={value}>
			{children}
		</ChatContext.Provider>
	)
}
