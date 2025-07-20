import { useState } from "react";

export function UserPanel({ userData, handleLogin, handleLogout, toggleUserProfile }) {
    let content;
    if (userData) {
        content = (
            <>
                <div className="user-profile">
                    <h2>{userData.name}</h2>
                    <a onClick={toggleUserProfile}>
                        <img src={userData.profileImg} alt="Profile picture" />
                    </a>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <i className='bxr bx-door'></i> 
                </button>
            </>
        );
    } else {
        content = (
            <div className="login-wrapper">
                <button onClick={handleLogin}>Login</button>
            </div>
        );
    }


    return (
        <div className={`side-panel user-panel box`}>
            {content}
        </div>
    );
}


export function UserProfilePage({ userData, setShowUserProfilePage, onSave }) {
    const [userInput, setUserInput] = useState(userData);

    return (
        <div className="user-profile-page">
            <div className="user-profile-edit">
                <div className="profile-img-wrapper">
                    <img src={userData.profileImg} alt="profile picture" />
                </div>
                <input value={userInput.name} className="profile-username-input" placeholder="new username..." 
                    onChange={(e) => setUserInput({...userInput, name: e.target.value}) }/>
                <input value={userInput.profileImg} className="profile-img-input" placeholder="img url..."
                    onChange={(e) => setUserInput({...userInput, profileImg: e.target.value}) }/>
            </div>
            <textarea value={userInput.about} placeholder="write a poem about yourself..."
                onChange={(e) => setUserInput({...userInput, about: e.target.value}) }/>
            <div className="edit-buttons">
                <button onClick={()=>{
                    onSave(userInput);
                }}>
                    Apply
                </button> 
                <button onClick={()=>{
                    setUserInput(userData);
                    setShowUserProfilePage(false);
                }}>
                    Cancel
                </button> 
            </div>
        </div>
    );
}