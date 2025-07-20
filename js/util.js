export function incrementUsersCount(incre) {
    const count = totalUsersCount();
    localStorage.setItem("total_users_count", count+incre);
}

export function totalUsersCount() {
    let count = localStorage.getItem("total_users_count");
    count = count ? Number.parseInt(count) : 0;
    return count;
}

export function updateUsernameCache(username) {
    if (username) {
        localStorage.setItem("cached_username", username);
    } else {
        localStorage.removeItem("cached_username");
    }
}

export function loadCachedUsername() {
    return localStorage.getItem("cached_username");
}

export function updateUserData(username, userData) {
    if (!userData) {
        localStorage.removeItem(`${username}_user`);
    } else {
        let data = JSON.stringify(userData);
        localStorage.setItem(`${username}_user`, data);
    }
}

export function loadUserData(username) {
    let userData = localStorage.getItem(`${username}_user`);
    userData = userData !== null ? JSON.parse(userData) : null;
    return userData;
}


function chatName(userId, contactId) {
    return `${userId}_${contactId}_chat`;
}

export function updateStoredChat(userId, contactId, ...messageObjs) {
    const name = chatName(userId, contactId);
    let chat = localStorage.getItem(name);
    chat = chat ? JSON.parse(chat) : [];
    for (const m of messageObjs) {
        chat.push(m);
    }
    localStorage.setItem(name, JSON.stringify(chat));
}

export function loadStoredChat(userId, contactId) {
    const name = chatName(userId, contactId);
    let chat = localStorage.getItem(name);
    chat = chat ? JSON.parse(chat) : [];
    return chat;
}