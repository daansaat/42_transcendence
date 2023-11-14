import './styles.css';
import axios from 'axios';
import { UserContext } from '../../../contexts'
import React, { useContext, useState, useEffect } from 'react';

type User = {
    avatar: string;
    userName: string;
    intraId: string;
	  isLogged: boolean;
	  score: number;
  };
  


  
export function Request() {
    const [users, setUsers] = useState<User[]>([]);
    const {user} = useContext(UserContext)

    const [friendRequest, setFriendRequest] = useState<boolean | null>(null);


  async function answerRequest(intraId:string, answer:string) {
    try{
          await axios.post(`http://f1r1s3.codam.nl:3001/friends/friend-request/${user.intraId}/${intraId}/${answer}`,null,{withCredentials:true})
          const updatedUsers = users.filter((user) => user.intraId !== intraId);
          setUsers(updatedUsers);
    }
    catch(error){
      localStorage.clear()
			window.location.href= '/login'
    }
    
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://f1r1s3.codam.nl:3001/friends/getFriendQuery/${user.intraId}`,{withCredentials:true})
        setUsers(response.data);
        setFriendRequest(response.data.length === 0 ? false : true)
      } catch (error) {
        localStorage.clear()
			window.location.href= '/login'
      }
    };

    fetchData();
  }, [user.intraId]);

    return(
      <>
    {friendRequest ?(
      
      users.map((user, index) => (
        <div className="friendRequestcomponent" key={user.intraId}>
            <div className="imageClassFR">
              <img src={user.avatar} id="Avatar" alt=""/>
            </div>
            <div className="friendRequestUsername">{user.userName}</div>
            <div className='friendReject'>
              <i className="bi bi-x-lg fs-4" onClick={(e) => answerRequest(user.intraId, "false")}/>
            </div>
            <div className='friendAccept'>
              <i className="bi bi-check2 fs-3" onClick={(e) => answerRequest(user.intraId, "true")}/>

            </div>
        </div>
      ))
    ) : (
      <p>You don't have friend request!</p>
    )}
    </>
    );
}