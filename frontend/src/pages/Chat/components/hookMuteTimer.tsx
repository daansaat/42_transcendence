import { useEffect, useState } from "react";
import { Member, useChat } from "../../../contexts";
import { useSocket } from "../../../contexts/SocketContext";

export function useMuteTimer(member: Member, roomName: string) {
  const [muteRemaining, setMuteRemaining] = useState<number>(0);
  const { updateRoomUser } = useChat();
  const { socket } = useSocket();
  
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const unmuteUser = async() => {
      await updateRoomUser({
        ...member,
        isMuted: false,
      }, roomName);
      socket.emit('memberUpdate', roomName);
    }

    if (member.isMuted && member.muteEndTime) {
      const currentTime = new Date();
      const muteEndTime = new Date(member.muteEndTime);
      const diff = Math.floor((+muteEndTime - +currentTime) / 1000);
      setMuteRemaining(diff);

      if (diff > 0) {
        intervalId = setInterval(() => {
          setMuteRemaining((muteRemaining) => {
            if (muteRemaining <= 1) {
              clearInterval(intervalId);
              unmuteUser();
            }
            return muteRemaining - 1;
          });
        }, 1000);
      } else {
        unmuteUser();
      }
    } else {
      setMuteRemaining(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [member, roomName, updateRoomUser, socket]);

  return muteRemaining;
}
