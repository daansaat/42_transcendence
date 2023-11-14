import Particle from '../Login/Particle';
import swal from 'sweetalert';
import './styles.css'
import { useState, ChangeEvent, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts';

function Verify2fa() {

	const [inputText, setInputText] = useState("");

	const { user, setUser } = useContext(UserContext)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
		// console.log(e.target.value)
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (inputText.length !== 6){
			swal({
				title: "Error", 
				text: "Your key needs to be 6 digits!",
				icon: "warning",
				dangerMode: true
			})
		}
		else {
			try {
				// console.log("value is " + inputText + "user [" + JSON.stringify(user))
				const response = await axios.get(`http://f1r1s3.codam.nl:3001/auth/verify/${inputText}/${user.intraId}`, { withCredentials: true });
				if (response.data === true) {
					const updatedUser = { ...user, twoFactorCorrect: true };
					setUser(updatedUser);
					localStorage.setItem('user', JSON.stringify(updatedUser));
					window.location.href = "http://f1r1s3.codam.nl:3000/home"


				} else {
					swal({
						title: "Wrong key!", 
						text: "It doesn't match with system key!",
						icon: "warning",
						dangerMode: true
					})
				}

			}
			catch (error) {
				localStorage.clear()
				window.location.href = '/login'
			}
		}
	}


	return (
		<>
			<Particle />
			<div className="Auth2faLoginPage">
				<div className="Auth2faLoginContainer">
					<h3>Two-Factor Authentication</h3>
					<h5>Open the 'Google Authenticator' app</h5>
					<h5>and input the generated code</h5>
					<form className="LoginScannedCode" onSubmit={handleSubmit}>
						<input
							value={inputText}
							onChange={handleChange}
							className="LoginScannedCodeInput"
							type="text"
							placeholder="* Enter Generated Code"
						/>
						<button className="LoginSend2faButton">
							<i className="bi bi-send fs-3 LoginSend2fa"></i>
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Verify2fa;