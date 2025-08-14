import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import {
	loadUserData,
	totalUsersCount,
	updateUserData,
	incrementUsersCount,
	updateUsernameCache,
} from "../util";
import { contactsData } from "../data";

export async function loginAction({ request }) {
	const formData = await request.formData();
	const username = formData.get("username");

	if (username.trim().length === 0) return;

	let loginUser;
	const loadedUser = loadUserData(username);
	if (loadedUser) {
		loginUser = loadedUser;
	} else {
		loginUser = {
			id: totalUsersCount(),
			name: username,
			profileImg: "/img/default_profile_pic.png",
			about: "",
			displayMode: "dark-mode",
		};
		updateUserData(username, loginUser);
		incrementUsersCount(1);
	}

	updateUsernameCache(username);
	const firstContact = contactsData[0];
	return redirect(`/chat/${firstContact.name}`);
}

export function Login() {
	const [usernameInput, setUsernameInput] = useState("");

	return (
		<Form method="post" className="login-form">
			<input
				name="username"
				placeholder="username..."
				autoFocus
				value={usernameInput}
				onChange={(e) => {
					setUsernameInput(e.target.value);
				}}
			/>
			<button className={usernameInput.trim() ? "" : "hide"} type="submit">
				<i className="bxr  bx-rocket"></i>
			</button>
		</Form>
	);
}
