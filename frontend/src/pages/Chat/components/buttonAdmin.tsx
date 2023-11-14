import { Member, UserRole, useChat } from "../../../contexts/ChatContext";
import { BiSolidUserPlus } from "react-icons/bi"
import { useSocket } from "../../../contexts/SocketContext";

export const AdminButton: React.FC<{ member: Member }> = ({ member }) => { //send event to addamin? to update realtime settings option
  const { room, updateRoomUser } = useChat();
  const { socket } = useSocket();

  async function handleClick(e: React.MouseEvent, member: Member) {
    e.stopPropagation();

    await updateRoomUser({
      ...member,
      userRole: UserRole.ADMIN,
    }, room.roomName);
    socket.emit('memberUpdate', room.roomName); //not for unreadmessages

  };

  return (
    <button className="iconBtn" onClick={(e) => handleClick(e, member)}>
      <BiSolidUserPlus size="2em" color="royalblue" />
    </button>
  )
}
