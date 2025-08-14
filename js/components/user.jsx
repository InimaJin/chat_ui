import { useState, useContext } from "react";
import {
	Form,
	Link,
	redirect,
	useLoaderData,
	useNavigate,
	useOutletContext,
} from "react-router-dom";
import { DisplayModeCtx } from "../context";
import { loadUserData, updateUserData, updateUsernameCache } from "../util";
import { contactsData } from "../data";

export function UserPanel({ ref, userData, setUserData, handleLogout, params }) {
	const { displayMode, updateDisplayMode } = useContext(DisplayModeCtx);

	let content = null;
	if (userData) {
		content = (
			<>
				<button
					onClick={() => ref.current.classList.remove("active")}
					className="mobile-btn back-btn"
				>
					<i className="bxr  bx-arrow-left-stroke"></i>
				</button>
				<Link
					to={params.username && params.userId ? -1 : `/user/${userData.name}/${userData.id}`}
					onClick={() => {
						ref.current.classList.remove("active");
					}}
					className="user-profile"
				>
					<h2>{userData.name}</h2>
					<img src={userData.profileImg} alt="Profile picture" />
				</Link>
				<div className="user-buttons">
					<button
						className="hover-btn round-btn"
						onClick={() => {
							const nextMode =
								displayMode === "dark-mode" ? "light-mode" : "dark-mode";
							updateDisplayMode(nextMode);
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
					<Link to={"/"}>
						<button onClick={handleLogout} className="hover-btn round-btn">
							<i className="bxr bx-door"></i>
						</button>
					</Link>
				</div>
			</>
		);
	} else {
		content = (
			<div className="login-wrapper">
				<button className="hover-btn round-btn">
					<Link to={"/login"}>Login</Link>
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

export function profilePageLoader({ params }) {
	const id = parseInt(params.userId);
	const profileData =
		id >= 0
			? loadUserData(params.username)
			: contactsData.find((c) => c.id === id);
	return profileData;
}

export async function profilePageAction({ params, request }) {
	const formData = await request.formData();
	const updateUser = {
		id: parseInt(params.userId),
		name: formData.get("username"),
		profileImg: formData.get("profile-img"),
		about: formData.get("about"),
		displayMode: loadUserData(params.username).displayMode,
	};

	updateUserData(params.username, null);
	updateUserData(updateUser.name, updateUser);
	updateUsernameCache(updateUser.name);

	return redirect("/");
}

export function UserProfilePage() {
	const [userId, userDataChanged, navigate] = useOutletContext();
	const profileData = useLoaderData();
	const isUser = userId === profileData.id;

	const [userInput, setUserInput] = useState(profileData);

	let backButton = null;
	if (!isUser) {
		backButton = (
			<Link to={"/"} className="mobile-btn back-btn">
				<i className="bxr  bx-arrow-left-stroke"></i>
			</Link>
		);
	}

	return (
		<Form
			onSubmit={() => (userDataChanged.current = !userDataChanged.current)}
			method="post"
			className="user-profile-page"
		>
			{backButton}
			<div className="user-profile-edit">
				<div className="profile-img-wrapper">
					<img src={profileData.profileImg} alt="profile picture" />
				</div>
				{isUser ? (
					<>
						<input
							name="username"
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
							name="profile-img"
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
						<h2>{profileData.name}</h2>
					</>
				)}
			</div>
			{isUser ? (
				<>
					<textarea
						name="about"
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
						<button type="submit" className="hover-btn">
							Apply
						</button>
						<button onClick={() => navigate(-1)} type="button" className="hover-btn">
							Cancel
						</button>
					</div>
				</>
			) : (
				<p>{profileData.about}</p>
			)}
		</Form>
	);
}
