import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "../UserContext/provider";
import { useNavigate } from 'react-router-dom'
import './styles.css'

type SocketContextValue = {
	URL: string,
	socket: Socket,
}

const URL = 'http://f1r1s3.codam.nl:3001';
const socket = io(URL, { autoConnect: false });
const SocketContext = createContext({} as SocketContextValue);

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({ children }: {children: ReactNode}) {
	const [invitationUserName, setInvitationUserName] = useState(' ');
	const [invitationId, setinvitationId] = useState(' ');
	const { user } = useUser();
	const navigate = useNavigate();
	const [gameInvitation, setGameInvitation] = useState(false);

	useEffect(() => {
		function onGameInvite(data: any) {
		  setGameInvitation(true);
		  setInvitationUserName(data.userName);
		  setinvitationId(data.id);
		  console.log("You have an invitation from: ", data.userName);
		}
		

		socket.on('gameinvite', onGameInvite);
		
		return () => {
		  socket.off('gameinvite', onGameInvite);
		};
	  });

	  useEffect(() => {
		function onInvitationDeleted(data: any) {
			console.log('Invitation deleted event received', data);
		  setGameInvitation(false);
		}
		

		socket.on('invitationDeleted', onInvitationDeleted);
		
		return () => {
		  socket.off('invitationDeleted', onInvitationDeleted);
		};
	  });

	  useEffect(() => {
		function onAccept(data: any) {
		  setGameInvitation(false);
		  console.log("Accept: ", data.message);
		  navigate('/friendGame');
		}
		

		socket.on('gameAccepted', onAccept);
		
		return () => {
		  socket.off('gameAccepted', onAccept);
		};
	  }, );


	  
// /////////////////////////////////////////////////ibulak
    // const {user} = useContext(UserContext)
		
	useEffect(() => {
		if(user.userName !== 'unknown') {
			socket.auth = { 
				name: user.userName ,
				intraId: user.intraId,
			}
			socket.connect();
		};

	}, [user])

	// useEffect(() => {
	// 	function onConnect() {
	// 		console.log('connected', socket)
	// 	};
	
	// 	function onDisconnect() {
	// 		console.log('disconnected', socket)
	// 	};
		
	// 	socket.on('connect', onConnect);
	// 	socket.on('disconnect', onDisconnect);
	
	// 	return () => {
	// 	  socket.off('connect', onConnect);
	// 	  socket.off('disconnect', onDisconnect);
	// 	 	socket.disconnect();
	// 	};
	// }, [user]);

	const value = {
		URL,
		socket,
	}

	const handleAccept = () => {
		// inviteId: Daveti kabul etmek istediğimiz davetin id'si
		const inviteId = invitationId;
		socket.emit('AcceptInvitation', { id: inviteId });
		console.log('invitation accepted');

	}

	const handleReject = () => {
		// inviteId: Daveti kabul etmek istediğimiz davetin id'si
		const inviteId = invitationId;
		socket.emit('RejectInvitation', { id: inviteId });
		console.log('invitation rejected');
		setGameInvitation(false);

	}


    return (
        <SocketContext.Provider value={value}>
			{gameInvitation && 
			<div className="invitation">
				You have a game invitation from {invitationUserName}!
				<button className="accept" onClick={handleAccept}>Accept</button>
				<button className="reject" onClick={handleReject}>Reject</button>
			</div>}
            {children}
        </SocketContext.Provider>
    );
}