export const contactsData = [
    {
        id: -1,
        name: "Echo",
        currentMessage: "",
        replyFn: (msg) => msg
    },
    {
        id: -2,
        name: "Reverse",
        currentMessage: "",
        replyFn: (msg) => {
            const rev = new Array(msg.length);
            let i = msg.length-1;
            for (const c of msg) {
                rev[i] = c;
                i --;
            }
            return rev.join("");
        }
    }
];
