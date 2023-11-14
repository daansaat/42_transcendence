import { useEffect, useRef } from "react"
import { Message } from "../../../contexts/ChatContext/types"
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";

export const MessageWindow = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useSocket();
  const { user } = useUser();
  const { room, blocked, messages, setMessages, updateRoomUser, myRooms } = useChat();

  useEffect(() => {
    const onMessage = (newMessage: Message) => {
      const isBlocked = blocked.some(blocked => blocked.userName === newMessage.userName);
      if (!isBlocked) {
        if (newMessage.roomName === room.roomName) {
          setMessages(prevMessages => [...prevMessages, newMessage]);
        } else {
          const foundRoom = myRooms.find(room => room.roomName === newMessage.roomName);
          if (foundRoom) {
            updateRoomUser({
              ...user,
              ...foundRoom,
              unreadMessages: foundRoom.unreadMessages + 1,
            }, newMessage.roomName);
          }
        }
      } 
    };

    socket.on('onMessage', onMessage);
    return () => {
      socket.off('onMessage');
    }
  }, [room, myRooms, blocked, setMessages, socket, updateRoomUser, user])

  useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div id="chat-window">
        {messages.map((message) => 
          message.userName === user.userName ? (
            <div className="message-chats" key={message.id}>
              <p className="sender-name-you">You</p>
              <div className="message-sender">
                <p>{message.content}</p>
              </div>
            </div>
          ) : (
            <div className="message-chats" key={message.id}>
              <p className="sender-name">{message.userName}</p>
              <div className="message-recipient">
                <p>{message.content}</p>
              </div>
            </div>
          )
        )}
        <div ref={lastMessageRef} />
    </div>
  )
}
