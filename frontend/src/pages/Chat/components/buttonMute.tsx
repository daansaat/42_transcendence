import { useChat } from "../../../contexts";
import { Member } from "../../../contexts/ChatContext/types"
import { useSocket } from "../../../contexts/SocketContext";
import { useMuteTimer } from "./hookMuteTimer";
import { BiSolidUserVoice } from "react-icons/bi"

export const MuteButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, updateRoomUser } = useChat();
  const muteRemaining = useMuteTimer(member, room.roomName)
  const { socket } = useSocket()

  async function handleClick(e: React.MouseEvent, member: Member, muteAction: boolean) {
    e.stopPropagation();
    const muteDuration = 60;
    const muteEndTime = new Date(Date.now() + muteDuration * 1000);

    await updateRoomUser({
      ...member,
      isMuted: muteAction,
      muteEndTime,
    }, room.roomName);
    socket.emit('memberUpdate', room.roomName); 
  }

  return(
    muteRemaining > 0
    ? 
      ( 
        <button className="iconBtn" onClick={(e) => handleClick(e, member, false)}>
          <BiSolidUserVoice size="2em" color="grey" />
        <span style={{fontSize: '10px'}}>
          {Math.floor(muteRemaining)}
        </span>
        </button>
      ) 
    : <button className="iconBtn" onClick={(e) => handleClick(e, member, true)}>
        <BiSolidUserVoice size="2em" />
      </button>
  )
}
