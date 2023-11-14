import './styles.css'
import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../../../contexts'
import { AchievementType } from '../../../../AchievementsEnum';

type User = {
	id: number;
    avatar: string;
    userName: string;
    intraId: string;
	isLogged: boolean;
	totalWin: number;
	totalLoose: number;
	score: number;
	rank: number;
  };

function LeaderBoard() {

	const [users, setUsers] = useState<User[]>([]);
	const { user, setUser } = useContext(UserContext);

	const effectHasRunRef = useRef(false);

	useEffect(() => {
		const fetchData = async () => {
		//   console.log(user.userName);
		  try {
			const response = await axios.get('http://f1r1s3.codam.nl:3001/friends/allUsers', {withCredentials:true});
			setUsers(response.data);
			// response.data.forEach((user1 :any) => {
			// 	if(user1.intraId === user.intraId){
			// 		const updatedUser = { ...user, totalWin: user1.totalWin, totalLoose: user1.totalLoose, rank: user1.rank, score: user1.score, inGame:user1.inGame};
			// 		setUser(updatedUser)
			// 		localStorage.setItem('user', JSON.stringify(updatedUser));

			// 	}
			// });

			const matchedUser = response.data.find((user1: any) => user1.intraId === user.intraId);

			if (matchedUser) {
				effectHasRunRef.current = true;
			  	const updatedUser = {
					...user,
					totalWin: matchedUser.totalWin,
					totalLoose: matchedUser.totalLoose,
					rank: matchedUser.rank,
					score: matchedUser.score,
					inGame: matchedUser.inGame,
			  };
			  setUser(updatedUser);
			  localStorage.setItem('user', JSON.stringify(updatedUser));
			}
			
			if(user.totalWin > 4){
				try{
						await axios.post(`http://f1r1s3.codam.nl:3001/user/setAchievements/${user.intraId}/${AchievementType.PONG_WHISPERER}`, null,{withCredentials:true})
						console.log("succes")
					}
				catch(error){console.log("error")}
			}
			if(user.totalWin > 0){
					try{
							await axios.post(`http://f1r1s3.codam.nl:3001/user/setAchievements/${user.intraId}/${AchievementType.FIRST_VICTORY}`, null,{withCredentials:true})
							console.log("succes")
						}
					catch(error){console.log("error")}
				}
				if(user.totalLoose > 0){
						try{
								await axios.post(`http://f1r1s3.codam.nl:3001/user/setAchievements/${user.intraId}/${AchievementType.EPIC_FAIL}`, null,{withCredentials:true})
								console.log("succes")
							}
						catch(error){console.log("error")}
					}
			
		  } catch (error) {
			localStorage.clear()
			window.location.href= '/login'
		  }
		};
		fetchData();
		// eslint-disable-next-line
	  }, [ user.userName ]);


	return (
		<div className="UserScoreSection">
			{( users.length ) ? (
				users
				.sort((a, b) => a.rank - b.rank)
				.map((user) => {
					return(
					<div className="UserScoreComponent" key={user.intraId}>
						<div className='UserScoreHash'>
							<i className="bi bi-hash fs-3"></i>
						</div>
						<div className="UserScoreRank">{user.rank}</div>
						<div className="imageClassUS">
							<img src={user.avatar} id="Avatar" alt=""/>
						</div>
						<div className="UserScoreUsername">{user.userName}</div>
						<div className="UserScoreValue">{user.score}</div>
					</div>
					);
				})
			) : (
					<p>No users found</p>
			)}
		</div>
		);
	};
	
	export default LeaderBoard;