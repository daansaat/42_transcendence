// import { SettingsIcon } from '../../assets'
// import { Button } from './Button'
// import { Modal } from './Modal'
import { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocket } from "../../../../contexts"
import queryString from 'query-string';
import './styles.css'

export enum GameType {
  CLASSIC = 0,
  CUSTOM = 1,
}

export function WaitingPage1() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();


  useEffect(() => {
    function onMatched() {
        console.log('matched');
        setIsLookingForOpponent(false);
        navigate('/random');
    }
    socket.on("matchFound", onMatched);
    return () => {
      socket.off('matchFound', onMatched);
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelMatching() {
        // console.log('cancel');
        setIsLookingForOpponent(false);
        navigate('/lobby');
    }
    socket.on("gameUnqueued", onCancelMatching);
    return () => {
      socket.off('gameUnqueued', onCancelMatching);
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket.emit("matchMaking", {type: 'CLASSIC'});
    return () => {
      socket.off('matchMaking');
    };
  }, [socket]);

  const handleClose = () => {
    socket.emit("cancelMatching");
    // console.log('idil');
    setIsLookingForOpponent(false);
    navigate('/lobby');
  };

  return (
    <>
    <div className="mainWaitinRoom">
      {isLookingForOpponent && (
        <div className='installing'>
          <p className="loader"></p>
          <p>Looking for an opponent</p>
          <button className='close' onClick={handleClose}>
            Cancel Game Request
          </button>
        </div>
        
      )}
     </div> 
    </>
  )
}

export function WaitingPage2() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = queryString.parse(location.search);
  const username = queryParams.username;

  useEffect(() => {
    function onSend() {
        // console.log('++++++++invite send, waiting for respond');
        setIsLookingForOpponent(true);
    }
    socket.on("invitesent", onSend);
    return () => {
      socket.off('invitesent', onSend);
      // socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    function onAccepted() {
        setIsLookingForOpponent(false);
        navigate('/friendgame');
    }
    socket.on("gameAccepted", onAccepted);
    return () => {
      socket.off('gameAccepted', onAccepted);
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelInvite(data: any) {
        const isConfirmed = window.confirm(data);
        if(isConfirmed) {
            setIsLookingForOpponent(false);
            navigate(-1);
        }
    }
    socket.on("error", onCancelInvite);
    return () => {
      socket.off('error', onCancelInvite);
    };
  }, [socket, navigate]);

  useEffect(() => {
    async function onInviteRefused(data: any) {
        const isConfirmed = data;
        if(isConfirmed) {
            setIsLookingForOpponent(false);
            // navigate(-1);
        }
    }
    socket.on("inviteRefused", onInviteRefused);
    return () => {
      socket.off('inviteRefused', onInviteRefused);
    };
  }, [socket, navigate]);


  useEffect(() => {
    socket.emit("Invite", { userName: username, type: 'CLASSIC' });
    return () => {
    };
  }, [socket, username]);

  const handleClose = () => {
    socket.emit("Uninvite", { userName: username });
    // console.log('idil');
    setIsLookingForOpponent(false);
    navigate(-1);
  };

  const handleExit = () => {
    socket.emit("Uninvite", { userName: username });
    // console.log('idil');
    // setIsLookingForOpponent(false);
    navigate(-1);
  };

  return (
    <>
    <div className="mainWaitinRoom">
      {isLookingForOpponent && (
        <div className='installing'>
          <p className="loader"></p>
          <p>Hang tight! Your friend is still thinking it over...</p>
          <button className='close' onClick={handleClose}>
            Cancel Invite
          </button>
        </div>
      )}
      {!isLookingForOpponent && (
        <div className='rejected'>
          Your friend rejected you!
          <button className='close' onClick={handleExit}>
            Turn back
          </button>
        </div>
      )}
    </div>
    </>
  )
}

export function WaitingPage3() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();


  useEffect(() => {
    function onMatched() {
        console.log('matched');
        setIsLookingForOpponent(false);
        navigate('/random');
    }
    socket.on("matchFound", onMatched);
    return () => {
      socket.off('matchFound', onMatched);
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelMatching(data: any) {
        console.log('cancel', data);
        setIsLookingForOpponent(false);
        navigate('/lobby');
    }
    socket.on("gameUnqueued", onCancelMatching);
    return () => {
      socket.off('gameUnqueued', onCancelMatching);
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket.emit("matchMaking", {type: 'CUSTOM'});
    // console.log('rewuested')
    return () => {
      socket.off('matchMaking');
    };
  }, [socket]);

  const handleClose = () => {
    socket.emit("cancelMatching");
    // console.log('idil');
    setIsLookingForOpponent(false);
    navigate('/lobby');
  };

  return (
    <>
    <div className="mainWaitinRoom">
      {isLookingForOpponent && (
        <div className='installing'>
          <p className="loader"></p>
          <p>Looking for an opponent</p>
          <button className='close' onClick={handleClose}>
            Cancel Game Request
          </button>
        </div>
        
      )}
    </div>
    </>
  )
}


