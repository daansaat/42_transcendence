import { RoomType, User, UserRole, useChat, useUser } from "../../../contexts";
import { useSocket } from "../../../contexts/SocketContext";

export const useSetupDmConversation = () => {
  const { user } = useUser();
  const { socket } = useSocket();
  const { setRoom, setMyRooms, createNewRoom, addRoomUser } = useChat();

  return async(contact: User) => {
    const sortedIntraId = [user.intraId, contact.intraId].sort();
    const joinedIntraId = sortedIntraId.join('');
  
    try {
      await createNewRoom({			
        roomName: joinedIntraId,
        type: RoomType.DIRECTMESSAGE,
      });
    
      const newRoomUser1 = await addRoomUser({
        roomName: joinedIntraId,
        userName: user.userName,
        userRole: UserRole.MEMBER,
        contactName: contact.userName,
      });
    
      const newRoomUser2 = await addRoomUser({
        roomName: joinedIntraId,
        userName: contact.userName,
        userRole: UserRole.MEMBER,
        contactName: user.userName,
      });
    
      if (newRoomUser1) {
        setMyRooms(prev => [...prev, newRoomUser1])
        setRoom(newRoomUser1);
        socket.emit('joinRoom', joinedIntraId);
      }
    
      if (newRoomUser2) {
        socket.emit('roomInvite', {
          ...newRoomUser2,
          intraId: contact.intraId, 
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
