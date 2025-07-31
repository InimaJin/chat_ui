import { useRef, useEffect, useState } from "react";

import { updateStoredChat } from "./util";

function scrollToMessage(msg, behavior, block) {
	msg.scrollIntoView({ behavior: behavior, block: block });
}

function TopBar({ chat, contactsPanelRef, userPanelRef }) {
	const [query, setQuery] = useState("");
	const resultIdx = useRef(-1);

	/* Finds the message that matches the current query and scrolls to it.
	 * Triggered by changing the query itself or by using the previous/ next buttons.
	 * prev === true => Go to prev matching message.
	 * prev === false => Go to next matching message. */
	function getNext(query, prev) {
		if (!query.trim()) return;

		if (resultIdx.current === -1) {
			resultIdx.current = chat.length;
		}

		const incre = prev ? -1 : 1;

		for (
			let i = resultIdx.current + incre;
			i >= 0 && i < chat.length;
			i += incre
		) {
			const msg = chat[i];
			const msgText = msg.text.toLowerCase();
			if (msgText.includes(query.toLowerCase())) {
				resultIdx.current = i;
				const element = document.querySelector(`#msg-${msg.msgId}`);
				scrollToMessage(element, "smooth", "start");
				break;
			}
		}
	}

	function showSidepanel(panelRef) {
		panelRef.current.classList.add("active");
	}

	const hideSearchButtons = query.trim().length === 0 ? "hide" : "";

	return (
		<div className="top-bar">
			<button
				className="mobile-btn"
				onClick={() => showSidepanel(contactsPanelRef)}
			>
				<i className="bxr  bxs-contact-book"></i>
			</button>
			<input
				value={query}
				placeholder="search messages..."
				onChange={(e) => {
					resultIdx.current = -1;
					const input = e.target.value;
					setQuery(input);
					getNext(input, true);
				}}
			/>
			<button
				className={hideSearchButtons}
				onClick={() => getNext(query, true)}
			>
				<i className="bxr  bx-arrow-up"></i>
			</button>
			<button
				className={hideSearchButtons}
				onClick={() => getNext(query, false)}
			>
				<i className="bxr  bx-arrow-down"></i>{" "}
			</button>
			<button
				className="mobile-btn"
				onClick={() => showSidepanel(userPanelRef)}
			>
				<i className="bxr  bxs-user"></i>
			</button>
		</div>
	);
}

/* A single message in the chat history between the user and a contact. Graphical representation of an individual
 * message object in the chat array. */
function Message({ ref, userId, messageObj }) {
	const msgType = userId === messageObj.sender ? "msg-sent" : "msg-recv";
	const date = new Date(messageObj.timestamp);
	const timestamp = new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
	return (
		<div
			id={`msg-${messageObj.msgId}`}
			ref={ref}
			className={"message-wrapper " + msgType}
		>
			<p className="msg-timestamp">{timestamp}</p>
			<div className="message-body">{messageObj.text}</div>
		</div>
	);
}

/* Window for chat history and text input. */
export function ChatWindow({
	userData,
	activeContact,
	chat,
	setChat,
	contacts,
	setContacts,
	contactsPanelRef,
	userPanelRef,
}) {
	const latestMessageRef = useRef(null);

	const [scrollDown, setScrollDown] = useState(false);
	const chatInputRef = useRef(null);
	useEffect(() => {
		chatInputRef.current.focus();
		if (latestMessageRef.current) {
			scrollToMessage(latestMessageRef.current, "instant", "end");
		}
	}, [activeContact, scrollDown]);

	const contactData = contacts.find((c) => c.id === activeContact);

	function onTextChange(newText) {
		const nextContacts = contacts.map((c) => {
			return c.id === activeContact
				? {
						...c,
						currentMessage: newText,
					}
				: c;
		});
		setContacts(nextContacts);
	}

	function handleSubmit() {
		const message = contactData.currentMessage.trim();
		if (message) {
			const timestamp = Date.now();
			const sentMessage = {
				msgId: chat.length,
				sender: userData.id,
				receiver: activeContact,
				timestamp: timestamp,
				text: message,
			};
			const reply = {
				msgId: chat.length + 1,
				sender: activeContact,
				receiver: userData.id,
				timestamp: timestamp,
				text: contactData.replyFn(message),
			};
			const nextChat = [...chat, sentMessage, reply];

			setScrollDown(!scrollDown);
			setChat(nextChat);
			updateStoredChat(userData.id, activeContact, sentMessage, reply);
			onTextChange("");
		}
	}

	const messages = chat.map((o, i) => {
		const ref = i === chat.length - 1 ? latestMessageRef : null;
		return (
			<Message key={o.msgId} ref={ref} userId={userData.id} messageObj={o} />
		);
	});

	return (
		<>
			<TopBar
				chat={chat}
				contactsPanelRef={contactsPanelRef}
				userPanelRef={userPanelRef}
			/>
			<div className="chat-history box">{messages}</div>
			<form className="chat-form box">
				<textarea
					ref={chatInputRef}
					className="message-input"
					value={contactData.currentMessage}
					onChange={(e) => onTextChange(e.target.value)}
				/>
				<div>
					<button
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						className="send-btn round-btn"
					>
						<i className="bx  bx-send"></i>
					</button>
				</div>
			</form>
		</>
	);
}
