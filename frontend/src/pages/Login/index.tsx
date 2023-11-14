import Particle from './Particle';
import fourtytwo from '../../img/ft.png'
import './styles.css'
import { useEffect } from 'react';

export function Login(){

	const goToLogin= async () =>{
		window.location.href = 'http://f1r1s3.codam.nl:3001/auth/login';
	}

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if(storedUser){
			window.location.href ='http://f1r1s3.codam.nl:3000/home'
		}
	  }, );

	return (
		<>
		<Particle/>
		<div className='LoginPageContent'>
			<div className='LoginIntro'>
				<h1>FT_TRANSCENDENCE</h1>
			</div>
			<button className='LoginWith42' onClick={goToLogin} >
				<img src={fourtytwo} className='ftLogo' alt='42 Logo'></img>
				<span className='ftLogin-text'>LOGIN WITH 42</span>
			</button>
		</div>
		</>
	);
  };
  
