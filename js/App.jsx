import { useState, useContext, useRef } from "react";

import { DisplayModeCtx } from "./context.jsx";
import {
	loadUserData,
	updateUserData,
	loadStoredChat,
	totalUsersCount,
	incrementUsersCount,
	loadCachedUsername,
	updateUsernameCache,
} from "./util.js";
import { ContactsPanel } from "./contacts.jsx";
import { ChatWindow } from "./chat.jsx";
import { UserPanel, UserProfilePage } from "./user.jsx";
import { contactsData } from "./data.js";

let propData;
export default function App() {
	const [userData, setUserData] = useState(loadUserData(loadCachedUsername()));
	const [contacts, setContacts] = useState(contactsData);
	const [activeContactId, setActiveContactId] = useState(-1);
	const [chat, setChat] = useState(
		userData ? loadStoredChat(userData.id, activeContactId) : []
	);

	const [displayMode, setDisplayMode] = useState(
		userData ? userData.displayMode : "dark-mode"
	);

	propData = {
		userData: userData,
		setUserData: setUserData,
		activeContact: activeContactId,
		setActiveContact: setActiveContactId,
		chat: chat,
		setChat: setChat,
		contacts: contacts,
		setContacts: setContacts,
	};

	return (
		<DisplayModeCtx
			value={{
				displayMode: displayMode,
				setDisplayMode: setDisplayMode,
			}}
		>
			<MainWindow {...propData} />
		</DisplayModeCtx>
	);
}

/* The primary application window. */
function MainWindow({
	userData,
	setUserData,
	activeContact,
	setActiveContact,
	setChat,
	contacts,
}) {
	const { displayMode, setDisplayMode } = useContext(DisplayModeCtx);

	const [showLoginForm, setShowLogin] = useState(false);
	const [usernameInput, setUsernameInput] = useState("");
	const [showUserProfilePage, setShowUserProfilePage] = useState(null);

	function fetchChat(nextContactId) {
		const storedChat = loadStoredChat(userData.id, nextContactId);
		setChat(storedChat);
	}

	function handleLogin() {
		if (usernameInput.length === 0) return;
		setUsernameInput("");
		setShowLogin(!showLoginForm);

		let loginUser = {
			id: totalUsersCount(),
			name: usernameInput,
			profileImg: "/img/default_profile_pic.png",
			about: "",
			displayMode: "dark-mode",
		};

		const loadedUser = loadUserData(usernameInput);
		if (loadedUser) {
			setDisplayMode(loadedUser.displayMode);
			loginUser = loadedUser;
		} else {
			updateUserData(usernameInput, loginUser);
			incrementUsersCount(1);
		}

		updateUsernameCache(usernameInput);
		setUserData(loginUser);

		const storedChat = loadStoredChat(loginUser.id, activeContact);
		setChat(storedChat);
	}

	const contactsPanelRef = useRef(null);
	const userPanelRef = useRef(null);

	let content;
	if (userData) {
		content = (
			<>
				<ContactsPanel
					ref={contactsPanelRef}
					contactsList={contacts}
					onContactSelect={(nextContactId) => {
						if (activeContact !== nextContactId) {
							fetchChat(nextContactId);
							setActiveContact(nextContactId);
							setShowUserProfilePage(null);
						} else {
							setShowUserProfilePage(
								showUserProfilePage === null ? nextContactId : null
							);
						}
					}}
					activeContact={activeContact}
				/>
				{showUserProfilePage !== null ? (
					<UserProfilePage
						isUser={showUserProfilePage === userData.id}
						userData={
							showUserProfilePage === userData.id
								? userData
								: contacts.find((c) => c.id === showUserProfilePage)
						}
						setShowUserProfilePage={setShowUserProfilePage}
						onSave={(newData) => {
							setUserData(newData);
							updateUserData(userData.name, null);
							updateUserData(newData.name, newData);
							updateUsernameCache(newData.name);
							setShowUserProfilePage(null);
						}}
					/>
				) : (
					<ChatWindow
						{...propData}
						contactsPanelRef={contactsPanelRef}
						userPanelRef={userPanelRef}
					/>
				)}
			</>
		);
	} else if (showLoginForm) {
		content = (
			<form className="login-form">
				<input
					placeholder="username..."
					autoFocus
					value={usernameInput}
					onChange={(e) => {
						setUsernameInput(e.target.value);
					}}
				/>
				<button
					className={usernameInput.trim() ? "" : "hide"}
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						handleLogin();
					}}
				>
					<i className="bxr  bx-rocket"></i>
				</button>
			</form>
		);
	}

	return (
		<>
			<div className={"main-window " + displayMode}>
				{content}
				<UserPanel
					ref={userPanelRef}
					userData={userData}
					handleLogin={() => {
						setShowLogin(!showLoginForm);
					}}
					handleLogout={() => {
						setUserData(null);
						updateUsernameCache(null);
						setShowUserProfilePage(null);
					}}
					toggleUserProfile={() => {
						setShowUserProfilePage(
							showUserProfilePage === null ? userData.id : null
						);
					}}
					setUserData={setUserData}
				/>
			</div>
		</>
	);
}
