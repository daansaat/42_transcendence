import './styles.css'
import React, { useEffect, useState } from 'react';
// import { UserContext } from '../../../../contexts'
import axios from 'axios';

type Props = {
	id: string;
};


type GameDto = {
    playerAvatar: string;
    opponentAvatar: string;
    playerUsername: string;
    opponentUsername: string;
    playerScore: number;
    opponentScore: number;
}

const MatchHistory: React.FC<Props> = ({ id }) => {

	const [matches, setMatches] = useState<GameDto[]>([]);


	
	useEffect(() => {
		const fetchData = async () => {
			try {
	
		
			const response = await axios.get(`http://f1r1s3.codam.nl:3001/game/${id}`,{withCredentials:true});
			setMatches(response.data)
				
		  } catch (error) {
			console.log(error)
			// localStorage.clear()
			// window.location.href= '/login'
		  }
		};
		fetchData();
	  }, [id]);
	


  return (
	<>
		<div className="MatchHistorySection">
	{( matches.length ) ? (
		matches.map((match, index) => (
	// There will be array of oponents match
			<div className={(match.playerScore > match.opponentScore) ? 'UserMatchHistory userWonMatch' : 'UserMatchHistory userLostMatch'} key={index}>
				<div className="imageUserMatch" id="imageFirstUser">
					<img src={match.playerAvatar} id="Avatar" alt=""/>
				</div>
				<div className="MatchHistoryScore" id="ScoreFirstUser">{match.playerScore}</div>
				<div className="VS">-</div>
				<div className="MatchHistoryScore" id="ScoreSecondUser">{match.opponentScore}</div>
				<div className="imageUserMatch" id="imageSecondUser">
					<img src={match.opponentAvatar} id="Avatar" alt=""/>
				</div>
			{/* <div className={isLost ? 'UserMatchHistory userLostMatch' : 'UserMatchHistory userWonMatch'}>
				<div className="imageUserMatch" id="imageFirstUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
					<div className="MatchHistoryScore" id="ScoreFirstUser">18</div>
					<div className="VS">-</div>
					<div className="MatchHistoryScore" id="ScoreSecondUser">22</div>
					<div className="imageUserMatch" id="imageSecondUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
				</div> */}
			{/* <div className="DummyContent"></div>
			<div className="DummyContent"></div> */}
		</div>
		))):
		(
			<p  className="NoUsersFound">You haven't played a match before!</p>
		)
		
	}
	</div>
	</>
	);
	}
  export default MatchHistory;