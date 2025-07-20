import { useState, useEffect } from "react";

import { loadUserData, updateUserData, loadStoredChat, totalUsersCount, incrementUsersCount, loadCachedUsername, updateUsernameCache } from "./util.js";
import { ContactsPanel } from "./contacts.jsx";
import { ChatWindow } from "./chat.jsx";
import { UserPanel, UserProfilePage } from "./user.jsx";
import { contactsData } from "./data.js";


/* The primary application window. */
function MainWindow({ children, userData, setUserData, activeContact, setActiveContact, setChat, contacts }) {
    const [showLogin, setShowLogin] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");
    const [showUserProfilePage, setShowUserProfilePage] = useState(false);

    function fetchChat(contactId) {
        if (contactId === activeContact) return;
        const storedChat = loadStoredChat(userData.id, contactId);
        setChat(storedChat);
        setActiveContact(contactId);
    }

    function handleLogin() {
        if (usernameInput.length === 0) return;
        setUsernameInput("");
        setShowLogin(!showLogin);

        let loginUser = {
            id: totalUsersCount(),
            name: usernameInput,
            profileImg: "/img/default_profile_pic.png",
            about: ""
        };

        const loadedUser = loadUserData(usernameInput);
        if (loadedUser) {
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


    let content;
    if (userData) {
        content = ( 
            <>
                <ContactsPanel contactsList={contacts} onContactSelect={(nextContactId)=>{
                    fetchChat(nextContactId);
                    setShowUserProfilePage(false);
                }} activeContact={activeContact} />
                {showUserProfilePage ? <UserProfilePage userData={userData} setShowUserProfilePage={setShowUserProfilePage} onSave={(newData) => {
                    setUserData(newData);
                    updateUserData(userData.name, null);
                    updateUserData(newData.name, newData);
                    updateUsernameCache(newData.name);
                    setShowUserProfilePage(false);
                }} /> : children}
            </>
        );
    } else if (showLogin) {
        content = (
            <form className="login-form">
                <input placeholder="username..." autoFocus value={usernameInput} onChange={(e)=>{
                    setUsernameInput(e.target.value);
                }} />
                <button className={usernameInput ? "" : "hide"} type="submit" onClick={(e)=>{
                    e.preventDefault();
                    handleLogin();
                }}><i className='bxr  bx-rocket'  ></i> </button>
            </form>
        );
    }

    return (
        <>
            <div className="main-window">
                {content}
                <UserPanel userData={userData} handleLogin={()=>{
                    setShowLogin(!showLogin)
                }} handleLogout={()=>{
                    setUserData(null);
                    updateUsernameCache(null);
                }} toggleUserProfile={()=>{
                    setShowUserProfilePage(!showUserProfilePage);
                }} />
            </div>
        </>
    );
}

export default function App() {
    const [userData, setUserData] = useState(null);
    const [contacts, setContacts] = useState(contactsData);
    const [activeContactId, setActiveContactId] = useState(-1);
    const [chat, setChat] = useState([]);

    //Attempt automatic login
    useEffect(()=>{
        const cachedUsername = loadCachedUsername();
        if (cachedUsername) {
            const data = loadUserData(cachedUsername);
            setUserData(data);
            setChat(loadStoredChat(data.id, activeContactId));
        }
    }, []);


    const data = {
        userData: userData, setUserData: setUserData,
        activeContact: activeContactId, setActiveContact: setActiveContactId,
        chat: chat, setChat: setChat,
        contacts: contacts, setContacts: setContacts
    };

    return (
        <>
            <MainWindow {...data}>
                <ChatWindow {...data} />
            </MainWindow>
        </>
    );
}