import { useState, useContext } from "react";
import { DisplayModeCtx } from "./context";
import { updateUserData } from "./util";

export function UserPanel({
	ref,
	userData,
	setUserData,
	handleLogin,
	handleLogout,
	toggleUserProfile,
	showLoginForm
}) {
	const { displayMode, setDisplayMode } = useContext(DisplayModeCtx);

	let content = null;
	if (userData) {
		content = (
			<>
				<button onClick={()=>ref.current.classList.remove("active")} className="mobile-btn back-btn">
					<i className='bxr  bx-arrow-left-stroke'></i>
				</button>
				<div onClick={()=>{
					toggleUserProfile();
					ref.current.classList.remove("active");
				}} className="user-profile">
					<h2>{userData.name}</h2>
					<img src={userData.profileImg} alt="Profile picture" />
				</div>
				<div className="user-buttons">
					<button
						className="hover-btn round-btn"
						onClick={() => {
							const nextMode =
								displayMode === "dark-mode" ? "light-mode" : "dark-mode";
							setDisplayMode(nextMode);
							const nextUserData = {
								...userData,
								displayMode: nextMode,
							};
							setUserData(nextUserData);
							updateUserData(userData.name, nextUserData);
						}}
					>
						<i
							className={`bxr  bx-${displayMode === "dark-mode" ? "sun" : "moon-star"}`}
						></i>
					</button>
					<button onClick={handleLogout} className="hover-btn round-btn">
						<i className="bxr bx-door"></i>
					</button>
				</div>
			</>
		);
	} else if (!showLoginForm) {
		content = (
			<div className="login-wrapper">
				<button className="hover-btn round-btn" onClick={handleLogin}>
					Login
				</button>
			</div>
		);
	}

	const panelClass = userData ? "" : "active";
	return (
		<div ref={ref} className={"side-panel user-panel " + panelClass}>
			{content}
		</div>
	);
}

export function UserProfilePage({
	isUser,
	userData,
	setShowUserProfilePage,
	onSave,
}) {
	const [userInput, setUserInput] = useState(userData);

	let backButton = null;
	if (!isUser) {
		backButton = (
			<button onClick={()=>setShowUserProfilePage(null)} className="mobile-btn back-btn">
				<i className='bxr  bx-arrow-left-stroke'></i>
			</button>
		);
	}

	return (
		<div className="user-profile-page">
			{backButton}
			<div className="user-profile-edit">
				<div className="profile-img-wrapper">
					<img src={userData.profileImg} alt="profile picture" />
				</div>
				{isUser ? (
					<>
						<input
							value={userInput.name}
							className="profile-username-input"
							placeholder="new username..."
							onChange={(e) =>
								setUserInput({
									...userInput,
									name: e.target.value,
								})
							}
						/>
						<input
							value={userInput.profileImg}
							className="profile-img-input"
							placeholder="img url..."
							onChange={(e) =>
								setUserInput({
									...userInput,
									profileImg: e.target.value,
								})
							}
						/>
					</>
				) : (
					<>
						<h2>{userData.name}</h2>
					</>
				)}
			</div>
			{isUser ? (
				<>
					<textarea
						value={userInput.about}
						placeholder="write a poem about yourself..."
						onChange={(e) =>
							setUserInput({
								...userInput,
								about: e.target.value,
							})
						}
					/>
					<div className="edit-buttons">
						<button
							onClick={() => {
								onSave(userInput);
							}}
							className="hover-btn"
						>
							Apply
						</button>
						<button
							onClick={()=>{
								setUserInput(userData);
								setShowUserProfilePage(null);
							}}
							className="hover-btn"
						>
							Cancel
						</button>
					</div>
				</>
			) : (
				<p>{userData.about}</p>
			)}
		</div>
	);
}
