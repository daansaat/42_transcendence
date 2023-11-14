import './styles.css';
import axios from 'axios';
import { UserContext } from '../../contexts'
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


enum userStatus {
  friends,
  nonFriends,
  query,
  me
};

type User = {
  avatar: string;
  userName: string;
  intraId: string;
  intraName: string;
  isLogged: boolean;
  userStatus: userStatus
};

export function Friends() {

  const [users, setUsers] = useState<User[]>([]);
  const { user } = useContext(UserContext)

  async function sendRequest(intraId: string) {
    try {
      await axios.post(`http://f1r1s3.codam.nl:3001/friends/add/${user.intraId}/${intraId}`,null,{withCredentials:true})
      getData()
    }
    catch (error) {
      localStorage.clear()
			window.location.href= '/login'
    }

  }

  async function removeFriend(intraId: string) {
    try {
      await axios.post(`http://f1r1s3.codam.nl:3001/friends/delete/${user.intraId}/${intraId}`,null,{withCredentials:true})
      getData()
    }
    catch (error) {
      localStorage.clear()
			window.location.href= '/login'
    }
  }

  async function getData() {
    try {
      const response = await axios.get(`http://f1r1s3.codam.nl:3001/friends/allUser/${user.intraId}` , {withCredentials:true});
      const { friends, nonFriends, me, query } = response.data;

      const usersData = [...friends.map((friend: User) => ({ ...friend, userStatus: userStatus.friends })),
      ...nonFriends.map((nonFriend: User) => ({ ...nonFriend, userStatus: userStatus.nonFriends })),
      ...query.map((query:User) =>({...query, userStatus: userStatus.query})),
      ...me.map((meUser: User) => ({ ...meUser, userStatus: userStatus.me }))];

      setUsers(usersData);
    } catch (error) {
      localStorage.clear()
			window.location.href= '/login'
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      
      getData()
    };

    fetchData();
  });

  return (
    <>
      {( users.length ) ? (
        users.map((user, index) => (

          <div className="friends-text-image-component" key={user.avatar}>
            <div className="imageClassPP">
              <img src={user.avatar} id="Avatar" alt="" />
            </div>
            <div className="friend-component-userName">{user.userName}</div>
            <div className="friend-component-intraName">
              <Link to={`/profile/${user.intraName}`} className="visitUserProfile">{user.intraName}</Link>
            </div>
            <div className='personOnlineContainer'>
              <i className="bi bi-circle-fill fs-5"
                id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
            </div>
            <div className='personAddContainer'>
              { (user.userStatus === 0) ? (
                  <i className="bi bi-person-dash fs-3" onClick={(e) => removeFriend(user.intraId)} />) :
                (user.userStatus === 1) ? (
                  <i className="bi bi-person-add fs-3" onClick={(e) => sendRequest(user.intraId,)} />) :
                (user.userStatus === 2)? (
                  <i className="bi bi-person-check fs-3"/> ) : <></>
              }
            </div>
          </div>
        ))
      ) : (
        <p>No users found</p>
      )}
    </>
  );
}