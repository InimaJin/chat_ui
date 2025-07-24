import { useRef, useEffect, useState } from "react";

import { updateStoredChat } from "./util";

/* A single message in the chat history between the user and a contact. Graphical representation of an individual
 * message object in the chat array. */
function Message({ ref, userId, messageObj }) {
    const msgType = userId === messageObj.sender ? "msg-sent" : "msg-recv";
    const date = new Date(messageObj.timestamp);
    const timestamp = new Intl.DateTimeFormat(
        undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);
    return (
        <div ref={ref} className={"message-wrapper " + msgType}>
            <p className="msg-timestamp">{timestamp}</p>
            <div className="message-body">
                {messageObj.text}
            </div>
        </div>
    );
}

/* Window for chat history and text input. */
export function ChatWindow({ userData, activeContact, chat, setChat, contacts, setContacts }) {
    const latestMessageRef = useRef(null);
    function scrollToLatestMessage() {
        latestMessageRef.current.scrollIntoView({behavior: "instant", block: "end"});
    }

    const [scrollDown, setScrollDown] = useState(false)
    const chatInputRef = useRef(null);
    useEffect(() => {
        chatInputRef.current.focus();
        if (latestMessageRef.current) {
            scrollToLatestMessage();
        }
    }, [activeContact, scrollDown]);


    const contactData = contacts.find(c => c.id === activeContact);

    function onTextChange(newText) {
        const nextContacts = contacts.map(c => {
                return c.id === activeContact ? {...c, currentMessage: newText} : c;
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
                text: message
            };
            const reply = {
                msgId: chat.length + 1,
                sender: activeContact,
                receiver: userData.id,
                timestamp: timestamp,
                text: contactData.replyFn(message)
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
        return <Message key={o.msgId} ref={ref} userId={userData.id} messageObj={o}/>;
    });

    return (
        <>
            <div className="chat-history box">
                {messages}
            </div>
            <form className="chat-form">
                <textarea ref={chatInputRef} className="message-input box"
                    value={contactData.currentMessage}
                    onChange={(e) => onTextChange(e.target.value)}
                />
                <div>
                    <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }} className="box send-btn hover-btn round-btn">
                        <i className='bx  bx-send'></i>
                    </button>
                </div>
            </form>
        </>
    );
}