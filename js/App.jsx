import { useState, useRef } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { DisplayModeCtx } from "./context.jsx";
import {
	loadUserData,
	loadStoredChat,
	loadCachedUsername,
	updateUsernameCache,
} from "./util.js";
import { ContactsPanel } from "./components/contacts.jsx";
import { UserPanel } from "./components/user.jsx";
import { contactsData } from "./data.js";


export default function App() {
	const navigate = useNavigate();
	const params = useParams();
	const location = useLocation();

	const [userData, setUserData] = useState(null);

	const [contacts, setContacts] = useState(contactsData);
	const [activeContactId, setActiveContactId] = useState(-1);
	const [chat, setChat] = useState([]);

	const [displayMode, setDisplayMode] = useState("dark-mode");

	const loadedData = loadUserData(loadCachedUsername());
	if (!userData && loadedData) {
		setUserData(loadedData);
		setChat(
			loadStoredChat(loadedData.id, activeContactId)
		);
		setDisplayMode(loadedData.displayMode);
	}

	function fetchChat(nextContactId) {
		const storedChat = loadStoredChat(userData.id, nextContactId);
		setChat(storedChat);
	}

	const contactsPanelRef = useRef(null);
	const userPanelRef = useRef(null);

	const showLoginForm = location.pathname === "/login";
	let content;
	if (userData) {
		const outletCtx = params.userId ? userData.id : [userData, activeContactId, chat, setChat, contacts, setContacts, contactsPanelRef, userPanelRef];

		content = (
			<>
				<ContactsPanel
					ref={contactsPanelRef}
					contactsList={contacts}
					onContactSelect={(nextContactId) => {
						if (activeContactId !== nextContactId || params.userId) {
							fetchChat(nextContactId);
							setActiveContactId(nextContactId);
							navigate("/");
						} else {
							const contact = contacts.find(c => c.id === activeContactId);
							navigate(`user/${contact.name}/${activeContactId}`);
						}
					}}
					activeContact={activeContactId}
				/>
				<Outlet context={outletCtx} />
			</>
		);
	} else if (showLoginForm) {
		content = <Outlet context={{setUserData: setUserData}}/>
	}



	return (
		<DisplayModeCtx
		value={{
			displayMode: displayMode,
			setDisplayMode: setDisplayMode
		}}>
			<div className={"main-window " + displayMode}>
				{content}
				<UserPanel
					ref={userPanelRef}
					userData={userData}
					handleLogout={() => {
						setUserData(null);
						updateUsernameCache(null);
						setChat(null);
					}}
					setUserData={setUserData}
				/>
			</div>
		</DisplayModeCtx>
	);
}
