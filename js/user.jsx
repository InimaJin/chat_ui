export function UserPanel({ userData, handleLogin, handleLogout }) {
    let content;
    if (userData) {
        content = (
            <>
                <div className="user-profile">
                    <h2>{userData.name}</h2>
                    <img src={userData.profileImg} alt="Profile picture" />
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