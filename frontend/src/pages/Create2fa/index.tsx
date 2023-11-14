import './styles.css'
import { useContext, ChangeEvent, useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import QRCodeImage from './qrCodeCreate';
import { UserContext } from '../../contexts';

function Auth2faPage() {
	const [inputText, setInputText] = useState("");

	const { user, setUser } = useContext(UserContext)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		// 👇 Store the input value to local state
		setInputText(e.target.value);
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
				const response = await axios.get(`http://f1r1s3.codam.nl:3001/auth/verify/${inputText}/${user.intraId}`, { withCredentials: true });
				if (response.data === true) {
					const updatedUser = { ...user, twoFactorCorrect: true, TwoFactorAuth: true };
					setUser(updatedUser);
					localStorage.setItem('user', JSON.stringify(updatedUser));
					window.location.href = 'http://f1r1s3.codam.nl:3000/settings'

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
		<div className="Auth2faPage">
			<div className="Auth2faContainer">
				<h5>Please scan the QR with</h5>
				<h5>'Google Authenticator' app</h5>
				<h5>and input the generated code</h5>
				<QRCodeImage />
				<form className="ScannedCode" onSubmit={handleSubmit}>
					<input
						value={inputText}
						onChange={handleChange}
						className="ScannedCodeInput"
						type="text"
						placeholder="* Enter Generated Code"
					/>
					<button className="Send2faButton" type="submit">
						<i className="bi bi-send fs-3 Send2fa"></i>
					</button>
				</form>
			</div>
		</div>
	);
};

export default Auth2faPage;
