import { useChat } from "../../../contexts";
import { Member } from "../../../contexts/ChatContext/types"
import { BiSolidUserMinus } from "react-icons/bi"

export const KickButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, removeRoomUser } = useChat();
  const handleClick = async(e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    
    removeRoomUser(room.roomName, member.userName, member.intraId);
  };

  return(
    <button className="iconBtn" onClick={(e) => handleClick(e, member)} title="kick">
      <BiSolidUserMinus size="2em" />
    </button>
  )
}