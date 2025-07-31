export const contactsData = [
	{
		id: -1,
		name: "Echo",
		profileImg: "/img/default_profile_pic.png",
		about: "Consider me a reflection of yourself.",
		currentMessage: "",
		replyFn: (msg) => msg,
	},
	{
		id: -2,
		name: "Reverse",
		profileImg: "/img/default_profile_pic.png",
		about: ".sehciwdnas ekil I",
		currentMessage: "",
		replyFn: (msg) => {
			const rev = new Array(msg.length);
			let i = msg.length - 1;
			for (const c of msg) {
				rev[i] = c;
				i--;
			}
			return rev.join("");
		},
	},
];
