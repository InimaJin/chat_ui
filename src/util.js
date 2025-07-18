function chatName(userId, contactId) {
    const parties = [userId, contactId];
    parties.sort();
    const [p1, p2] = parties;
    return `${p1}_${p2}_chat`;
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

export function readStoredChat(userId, contactId) {
    const name = chatName(userId, contactId);
    let chat = localStorage.getItem(name);
    chat = chat ? JSON.parse(chat) : [];
    return chat;
}