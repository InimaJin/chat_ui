import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App, { appLoader } from "./App.jsx";
import { ChatWindow, chatWindowLoader } from "./components/chat.jsx";
import {
	UserProfilePage,
	profilePageAction,
	profilePageLoader,
} from "./components/user.jsx";
import { Login, loginAction } from "./components/login.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		loader: appLoader,
		element: <App />,
		children: [
			{
				path: "chat/:activeContactName",
				loader: chatWindowLoader,
				element: <ChatWindow />,
			},
			{
				path: "user/:username/:userId",
				loader: profilePageLoader,
				action: profilePageAction,
				element: <UserProfilePage />,
			},
			{
				path: "login",
				action: loginAction,
				element: <Login />,
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router}>
			<App />
		</RouterProvider>
	</StrictMode>
);
