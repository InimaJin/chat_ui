import { useState } from "react";
import { updateStoredChat, readStoredChat } from "./util.js";
import { contactsData } from "./data.js";

function Header({ onLogin, userObj }) {
    return (
        <header>
            { userObj.name != null ? <h1>Hello, {userObj.name}!</h1> : <button className="hover-btn box" onClick={onLogin}>Login</button> }
        </header>
    );
}

/* A selectable contact in the list. Fetches and displays a new chat upon selection. */
function Contact({ id, name, isActive, onSelect }) {
    return (
        <button onClick={() => onSelect(id) } className="contact">
            {isActive ? <b>{name}</b> : name}
        </button>
    );
}

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
function ChatWindow({ userData, activeContact, chat, setChat, contacts, setContacts }) {
    const contactData = contacts[activeContact];

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
            updateStoredChat(sentMessage, reply);
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

/* The primary application window that holds contact list, chat history and text input. */
function MainWindow({ children, userData, activeContact, setActiveContact, setChat, contacts }) {
    function fetchChat(contactId) {
        const storedChat = readStoredChat(userData.id, contactId);
        setChat(storedChat);
        setActiveContact(contactId);
    }

    return (
        <>
            <div className="main-window">
                <div className="contacts box">
                    {
                        contacts.map(c =>
                            <Contact key={c.id} id={c.id} name={c.name} onSelect={fetchChat} isActive={c.id === activeContact} />
                        )
                    }
                </div>
                {children}
            </div>
        </>
    );
}

export default function App() {
    const [userData, setUserData] = useState({});
    const [contacts, setContacts] = useState(contactsData);
    const [activeContactId, setActiveContactId] = useState(0);
    const [chat, setChat] = useState([]);

    function login() {
        const username = prompt("Enter username");
        if (username.length === 0) return;

        const loginUser = {id: contacts.length, name: username};
        setUserData(loginUser);

        const storedChat = readStoredChat(loginUser.id, activeContactId);
        setChat(storedChat);
    }

    const data = {
        userData: userData,
        activeContact: activeContactId, setActiveContact: setActiveContactId,
        chat: chat, setChat: setChat,
        contacts: contacts, setContacts: setContacts
    };

    return (
        <>
            <Header onLogin={login}  userObj={userData}/>
            <div className="app">
                {userData.name != null &&
                    <MainWindow  {...data}>
                        <ChatWindow {...data} />
                    </MainWindow>
                }
            </div>
        </>
    );
}