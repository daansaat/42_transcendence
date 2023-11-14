import { useState } from "react";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat, useUser } from "../../../contexts";
import { useMuteTimer } from "./hookMuteTimer";

export const MessageInput = () => {
  const [message, setMessage] = useState<string>('');
  const { user } = useUser()
  const { socket } = useSocket();
  const { room, setAchievement } = useChat();
  const muteRemaining = useMuteTimer({...user, ...room}, room.roomName);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setAchievement();
    socket.emit('newMessage', {
        userName: user.userName,
        content: message,
        roomName: room.roomName,
    });
    setMessage('');
  }

  return (
    <div id="chat-footer">
    <form
        className="formMessageInput" 
        onSubmit={handleSendMessage}
        style={{
          backgroundImage: 'linear-gradient(to right, purple, red)', 
          backgroundSize: `${muteRemaining / 60 * 100}%`,
          backgroundRepeat: 'no-repeat',
          transition: 'all 1s ',
        }}
    >
        {muteRemaining > 0 
        ? <div className="mutedText">You are muted. Time remaining: {Math.floor(muteRemaining)} seconds</div>
        : (
          <>
          <input 
            type="text"
            placeholder="Write message"
            className="message-input"
            value={message}
            maxLength={100}
            onChange={(e) => setMessage(e.target.value)}>
          </input>
          <button className="sendBtn">SEND</button>
          </>
        )
        }
      </form>
    </div>
  )
}
