import { useState, useRef, useEffect } from "react";
import {
	Outlet,
	redirect,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";

import { DisplayModeCtx } from "./context.jsx";
import {
	loadUserData,
	loadCachedUsername,
	updateUsernameCache,
} from "./util.js";
import { ContactsPanel } from "./components/contacts.jsx";
import { UserPanel } from "./components/user.jsx";
import { contactsData } from "./data.js";

export function appLoader({ params }) {
	const username = loadCachedUsername();

	const activeContactName = params.activeContactName;
	if (!activeContactName && username) {
		return redirect(`chat/${contactsData[0].name}`);
	}
}

export default function App() {
	const navigate = useNavigate();
	const params = useParams();
	const location = useLocation();

	const [userData, setUserData] = useState(null);

	const [contacts, setContacts] = useState(contactsData);

	const loadedData = loadUserData(loadCachedUsername());
	if (!userData && loadedData) {
		setUserData(loadedData);
	}

	let activeContactId = useRef(-1);
	const contactName = params.activeContactName;
	if (contactName) {
		activeContactId.current = contacts.find((c) => c.name == contactName).id;
	}

	const contactsPanelRef = useRef(null);
	const userPanelRef = useRef(null);

	const showLoginForm = location.pathname === "/login";
	let content;
	if (userData) {
		const outletCtx = params.userId
			? userData.id
			: [userData, contacts, setContacts, contactsPanelRef, userPanelRef];

		content = (
			<>
				<ContactsPanel
					ref={contactsPanelRef}
					contactsList={contacts}
					onContactSelect={(clickedContact) => {
						const clickedContactData = contacts.find(
							(c) => c.id === clickedContact
						);

						if (activeContactId.current !== clickedContact || params.userId) {
							navigate(`chat/${clickedContactData.name}`);
						} else {
							navigate(
								`user/${clickedContactData.name}/${activeContactId.current}`
							);
						}
					}}
					activeContact={activeContactId.current}
				/>
				<Outlet context={outletCtx} />
			</>
		);
	} else if (showLoginForm) {
		content = <Outlet />;
	}

	const displayMode = userData ? userData.displayMode : "dark-mode";

	return (
		<DisplayModeCtx
			value={{
				displayMode: displayMode,
				updateDisplayMode: (nextMode) => {
					const nextData = { ...userData, displayMode: nextMode };
					setUserData(nextData);
				},
			}}
		>
			<div className={"main-window " + displayMode}>
				{content}
				<UserPanel
					ref={userPanelRef}
					userData={userData}
					handleLogout={() => {
						setUserData(null);
						updateUsernameCache(null);
					}}
					setUserData={setUserData}
				/>
			</div>
		</DisplayModeCtx>
	);
}
