import { Member, useChat } from "../../../contexts/ChatContext"
import { BiSolidUserX, BiSolidUserCheck } from "react-icons/bi"
import { useSocket } from "../../../contexts/SocketContext";

export const BanButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, updateRoomUser } = useChat();
  const { socket } = useSocket();

  async function handleClick(e: React.MouseEvent, member: Member, banAction: boolean) {
    e.stopPropagation();

    await updateRoomUser({
      ...member,
      isBanned: banAction,
    }, room.roomName);
    socket.emit('memberUpdate', room.roomName); //not for unreadmessages

  };

  return(
    member.isBanned 
    ? <button className="iconBtn" onClick={(e) => handleClick(e, member, false)}>
        <BiSolidUserCheck size="2em" color="green" />
      </button>
    : <button className="iconBtn" onClick={(e) => handleClick(e, member, true)}>
        <BiSolidUserX size="2em" color="red" />
      </button>
  )
}
