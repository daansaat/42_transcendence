import './styles.css'
import React, { ChangeEvent, useContext, useState, useRef } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { UserContext } from '../../contexts'

function SettingsPage() {


	const { user, setUser } = useContext(UserContext)
	const [inputText, setInputText] = useState("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
	};

	const inputRef = useRef<HTMLInputElement | null>(null);

	async function showAlert() {
		if (inputText === user.userName) {
			swal({
				title: "Error!",
				text: "You can't change to same name!",
				icon: "warning",
				dangerMode: true,
			}).then()
			return;
		}
		if (inputText.length === 0) {
			swal({
				title: "Error!",
				text: "Input empty!",
				icon: "warning",
				dangerMode: true,
			}).then()

			return;
		}
		if(inputText.length < 2){
			swal({
				title: "Error!",
				text: "Your name is too short!",
				icon: "warning",
				dangerMode: true,
			}).then()

			return;
		}
		if(inputText.length > 15){
			swal({
				title: "Error!",
				text: "Your name is too long!",
				icon: "warning",
				dangerMode: true,
			}).then()

			return;
		}

		try {
			const response = await axios.post("http://f1r1s3.codam.nl:3001/user/update-user-profile", {
				userName: inputText,
				avatar: user.avatar,
				intraId: user.intraId
			}, { withCredentials: true })
			if (response.data === true) {
				const updatedUser = { ...user, userName: inputText };
				setUser(updatedUser)
				localStorage.setItem('user', JSON.stringify(updatedUser));
				setInputText("");
				swal({
					title: "Succes!",
					text: "Your name has been saved! "
				})
			}
			else {
				swal({
					title: "Error!",
					text: "This name already in use!",
					icon: "warning",
					dangerMode: true,
				}).then()
			}
		}
		catch (error) {
			localStorage.clear()
			window.location.href = '/login'
		}

	}
	const [selectedFile, setSelectedFile] = useState<File | null>(null);


	async function postimage() {

		if (selectedFile) {
			const formData = new FormData()
			formData.append('avatar', selectedFile)
			const headers = { 'Content-Type': 'multipart/form-data' };
			try {
				 await axios
					.post(`http://f1r1s3.codam.nl:3001/user/avatar/${selectedFile.name + user.intraId}`,
						formData, { withCredentials: true, headers })

				const updatedUser = { ...user, avatar: `http://f1r1s3.codam.nl:3001/user/avatar/${selectedFile.name + user.intraId}` };
				setUser(updatedUser)
				localStorage.setItem('user', JSON.stringify(updatedUser));
				if (inputRef.current) {
					inputRef.current.value = '';
					swal({
						title: "Succes!",
						text: "Your photo has been saved! "
					})
				}
			}
			catch (error) {
				localStorage.clear()
				window.location.href = '/login'
			}
		}
	}



	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};


	async function handleClick2FA() {
		if (user.TwoFactorAuth) {

			try {

				const updatedUser = { ...user, TwoFactorAuth: false, twoFactorCorrect: false };
				setUser(updatedUser)
				localStorage.setItem('user', JSON.stringify(updatedUser));
				await axios.post(`http://f1r1s3.codam.nl:3001/auth/disabled2fa`,
					null, { withCredentials: true })
			}
			catch (error) {
				localStorage.clear()
				window.location.href = '/login'
			}

		} else {
			window.location.href = 'http://f1r1s3.codam.nl:3000/create2fa';
		}
	};

	const onSubmit = (e: any) => {
		e.preventDefault();
		return false
	}

	return (

		<div className="SettingsPageContent">
			<div className="SettingsPageContainer">
				<div className="ChangePP">
					<div className="imageContainer">
						<img src={user.avatar} className='profilePicture' alt='Avatar' />
					</div>
					<div>
						<input className='UploadPP' type='file' onChange={handleFileChange} accept='image/*' ref={inputRef} />
					</div>
					<div className="ChangePPLine">
						<button type="submit" className="SubmitButton" onClick={postimage}>
							<i className="bi bi-upload fs-2"></i>
							<h4>Upload Picture</h4>
						</button>

					</div>
				</div>
				<div className="ChangeOthers">
					<form className="EnterNameSttings"
						onSubmit={(e) => {onSubmit(e)}}>
						<div className="EditNameSettings">
							<input
								value={inputText}
								onChange={handleChange}
								className="NameInput"
								type="text"
								placeholder="* Change your name"
							/>
							<button type="submit" className="SubmitButton Edit" onClick={showAlert}>
								<i className="bi bi-pencil-square fs-5"></i>
								<h6>Edit</h6>
							</button>
						</div>
					</form>
					<div className="Info2fa">
						<h5>Secure your account with </h5>
						<h5>Two-Factor Authentication</h5>
					</div>
					<div className="Change2FA">
						<button type="submit" className="SubmitButton TwoFA" onClick={handleClick2FA}>
							<i className="bi bi-qr-code-scan fs-1"></i>
							<h4>{user.TwoFactorAuth ? 'Disable' : 'Enable'} 2FA</h4>
						</button>
					</div>
				</div>
			</div>
		</div>

	)
};

export default SettingsPage;