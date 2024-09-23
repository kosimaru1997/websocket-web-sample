
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, { rootLoader } from "./Root";
import { Chat2, chatLoader } from "./Chat2";
import { WebSocketProvider } from "./WebsocketContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebSocketProvider><Root /></WebSocketProvider>,
    loader: rootLoader,
    children: [
      {
        path: "chat/:roomId",
        element: <Chat2 />,
        loader: chatLoader
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);