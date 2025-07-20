import { updateStoredChat } from "./util";

/* A single message in the chat history between the user and a contact. Graphical representation of an individual
 * message object in the chat array. */
function Message({ userId, messageObj }) {
    const msgType = userId === messageObj.sender ? "msg-sent" : "msg-recv";
    return (
        <div className={"message " + msgType}>
            {messageObj.text}
        </div>
    );
}

/* Window for chat history and text input. */
export function ChatWindow({ userData, activeContact, chat, setChat, contacts, setContacts }) {
    const contactData = contacts.find(c => c.id === activeContact);

    function onTextChange(newText) {
        const nextContacts = contacts.map(c => {
                return c.id === activeContact ? {...c, currentMessage: newText} : c;
        });
        setContacts(nextContacts);
    }

    function handleSubmit() {
        const message = contactData.currentMessage;
        if (message) {
            const sentMessage = {
                msgId: chat.length,
                sender: userData.id,
                receiver: activeContact,
                text: message
            };
            const reply = {
                msgId: chat.length + 1,
                sender: activeContact,
                receiver: userData.id,
                text: contactData.replyFn(message)
            };
            const nextChat = [...chat, sentMessage, reply];

            setChat(nextChat);
            updateStoredChat(userData.id, activeContact, sentMessage, reply);
            onTextChange("");
        }
    }

    const messages = chat.map(o => <Message key={o.msgId} userId={userData.id} messageObj={o}/>);

    return (
        <>
            <div className="chat-history box">
                {messages}
            </div>
            <form className="chat-form">
                <textarea className="message-input box"
                    value={contactData.currentMessage}
                    onChange={(e) => onTextChange(e.target.value)}
                    autoFocus />
                <div>
                    <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }} className="box send-btn hover-btn">
                        <i className='bx  bx-send'></i>
                    </button>
                </div>
            </form>
        </>
    );
}