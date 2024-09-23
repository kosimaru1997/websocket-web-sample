import { Link, Outlet, useLoaderData } from "react-router-dom";
import { websocketManager } from "./websocketManager";
import { useEffect } from "react";
import { useWebSocket } from "./WebsocketContext";

export async function rootLoader({params}) {
  const data = await fetch('http://localhost:8003/api/chat/')
  .then(response => response.json())
  .then((data) => {return data});
  return {data}
}

export default function Root() {
    const { data } = useLoaderData();
    const socket = useWebSocket();
    console.log('socket:', socket)
    console.log(data)

    return (
      <>
      <div className="chat-room" style={{display: "flex"}}>
          <div id="sidebar" style={{ width: '25%', padding: '20px', marginRight: '20px', backgroundColor: "whitesmoke"}}>
            <h3>ユーザー</h3>
            <nav>
              <ul>
              {data.room_list && data.room_list.length > 0 ? (
                  data.room_list.map(user => (
                    <Link 
                      to={`chat/${user.room_id}`}
                    >
                      <li key={user.room_id} style={{padding: '10px', marginBottom: '10px', border: '1px, solid'}}>
                          <p>ルームID: {user.room_id}</p>
                          <p>メッセージ: {user.last_message}</p>
                          <p>未読件数: {user.unchecked_count}</p>
                      </li>
                    </Link>
                  ))
                ) : (
                  <li>No Data</li>
                )}
              </ul>
            </nav>
          </div>
          <div id="detail" style={{ minWidth: '60%', padding: '20px', border: '1px solid'}}>
            <Outlet/>
          </div>
        </div>
      </>
    );
  }