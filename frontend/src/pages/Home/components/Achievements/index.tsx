import './styles.css'
import React, { useEffect, useState } from 'react';
import social from '../../../../img/achievements/social.png'
import fresPaddle from '../../../../img/achievements/freshPaddle.png'
import chameleon from '../../../../img/achievements/chameleon.png'
import chatterBox from '../../../../img/achievements/chatterBox.png'
import whisperer from '../../../../img/achievements/pongWhisperer.png'
import victory from '../../../../img/achievements/firstVictory.png'
import fail from '../../../../img/achievements/epicFail.png'
import axios from 'axios';
import { AchievementType } from '../../../../AchievementsEnum';

type Props = {
	intraid: string;
};


const Achievements: React.FC<Props> = ({ intraid }) => {
	

	  interface AchievementData {
		[AchievementType.FRESH_PADDLE]: boolean;
		[AchievementType.FIRST_VICTORY]: boolean;
		[AchievementType.PONG_WHISPERER]: boolean;
		[AchievementType.CHATTERBOX]: boolean;
		[AchievementType.SOCIAL_BUTTERFLY]: boolean;
		[AchievementType.CHAMELEON_PLAYER]: boolean;
		// [AchievementType.FRIENDLY_RIVALRY]: boolean;
		[AchievementType.EPIC_FAIL]: boolean;
		id: number;
	  }

	  const [userData, setUserData] = useState<AchievementData| null>(null);


	useEffect(() => {
		const fetchData = async () => {
		  try {

			const response =  await axios.get(`http://f1r1s3.codam.nl:3001/user/achievements/${intraid}`,{withCredentials:true})
			setUserData(response.data[0]);
		  } catch (error) {
			localStorage.clear()
			window.location.href= '/login'
		  }
		};
		fetchData();
	  }, [ intraid ]);

	

  return (
	<div className="AchievementsSection">
	 		<div className="title-box">
	 			<div className="AchievementsTitle">ACHIEVEMENTS</div>
	 		</div>
			<div className="BadgesSection">
				<div className="badges">
					<div className="badgeClass">
						<img src={fresPaddle} className="badgeimage" alt="Fresh Paddle"
						id={(userData && userData[AchievementType.FRESH_PADDLE])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">FRESH PADDLE </h4>
					<div className="infoBadges">Created an account!</div>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={victory} className="badgeimage" alt="First Victory" 
						id={(userData && userData[AchievementType.FIRST_VICTORY])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">FIRST VICTORY</h4>
					<div className="infoBadges">Won first game!</div>

				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={whisperer} className="badgeimage" alt="Pong Whisperer" 
						id={(userData && userData[AchievementType.PONG_WHISPERER])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">PONG WHISPERER</h4>
					<div className="infoBadges">Won five games!</div>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={chatterBox} className="badgeimage" alt="Chatterbox" 
						id={(userData && userData[AchievementType.CHATTERBOX])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">CHATTERBOX</h4>
					<div className="infoBadges">Sent first message!</div>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={social} className="badgeimage" alt="Social Butterfly" 
						id={(userData && userData[AchievementType.SOCIAL_BUTTERFLY])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">SOCIAL BUTTERFLY</h4>
					<div className="infoBadges">Added first friend!</div>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={chameleon} className="badgeimage" alt="Chameleon Player" 
						id={(userData && userData[AchievementType.CHAMELEON_PLAYER])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">CHAMELEON PLAYER</h4>
					<div className="infoBadges">Uploaded new picture!</div>
				</div>
				{/* <div className="badges">
					<div className="badgeClass">
						<img src={rivalry} className="badgeimage" alt="Friendly Rivalry" 
						id={(userData && userData[AchievementType.FRIENDLY_RIVALRY])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText ">FRIENDLY RIVALRY</h4>
					<div className="infoBadges">First game invite!</div>
				</div> */}
				<div className="badges">
					<div className="badgeClass">
						<img src={fail} className="badgeimage" alt="Epic Fail" 
						id={(userData && userData[AchievementType.EPIC_FAIL])?"earned":"unearned"}/>
					</div>
					<h4 className="badgeText">EPIC FAIL</h4>
					<div className="infoBadges">Lost first game!</div>
				</div>
			</div>
	</div>
	);
  };
  
  export default Achievements;