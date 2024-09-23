import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useWebSocket } from "./WebsocketContext";
import { v4 as uuidv4 } from 'uuid'; 

export async function chatLoader({params}) {
    debugger
    const roomId = params.roomId; // roomIdを取得
    const data = await fetch(`http://localhost:8003/api/chat/${roomId}`) // roomIdをURLに埋め込み
    .then(response => response.json())
    .then((data) => {return data});
    return {data, roomId}
  }

export const Chat2 = () => {
    const socket = useWebSocket();
    const { data, roomId } = useLoaderData();
    console.log('fetch data' + data)
    const test = data.map((d) => {
        const m = {
            message: d.message,
            sender: d.user_id,
            position: "normal",
            direction: d.user_id == "22" ? "outgoing" : "incoming"
        }
        return m
    })
    // debugger
    const [messages, setMessages] = useState(test)
    console.log('rennderd message')
    console.log(messages)



    useEffect(() => {
        if(!socket) {
            console.log('chat2 websocket not connected')
            return;
        }
        // WebSocketからメッセージ受信時処理
        const messageHandler = (event) => {
            debugger
            console.log('chat画面でメッセージの受信に成功！！！！')
            console.log(event.data);
            const data = JSON.parse(event.data);
            if (data.room_id == roomId) {
                const m = {
                    message: data.message,
                    sender: data.user_id,
                    position: "normal",
                    direction: data.user_id == "22" ? "outgoing" : "incoming"
                }
                console.log('get message ' + m);

                // prevMessagesからdata.message_idと一致するidを持つメッセージを削除
                setMessages(prevMessages => 
                    prevMessages.filter(msg => msg.id !== data.message_id).concat(m) // 一致しないメッセージを残し、新しいメッセージを追加
                );
            }
        };
        // WebSocketからメッセージ受信時処理
        socket.addEventListener("message", messageHandler)
        return () =>  {
            socket.removeEventListener("message", messageHandler); 
        }
    }, [socket])

    // nested routesだとなぜか、messageの初期が変わっても画面再レンダリングがされないため一旦これで回避 
    useEffect(() => {
        const test = data.map((d) => {
            const m = {
                message: d.message,
                sender: d.user_id,
                position: "normal",
                direction: d.user_id == "22" ? "outgoing" : "incoming"
            }
            return m;
        });
        setMessages(test); // messagesを更新
    }, [roomId]); // dataが変更されたときに実行

    const handleSend = async (innerHtml: string, textContent: string) => {
        console.log(textContent)
        const message = {
            id: uuidv4(),
            message: textContent,
            sender: "22",
            position: "normal",
            direction: "outgoing",
            status: false,
        }
        debugger
        setMessages([...messages, message])

        // APIにPOSTリクエストを送信
        try {
            const response = await fetch('http://127.0.0.1:8003/api/chat/1', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: "22",
                    message: textContent,
                    message_id: message.id
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Message sent successfully:', data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
      };

    return(
        <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
        <ChatContainer>
            <MessageList>
            {messages.map((message, i) => (
                <div>
                <Message
                    key={i}
                    model={message}
                />
                { message?.status === false ?
                        <div className="status-display" style={{textAlign: 'right'}}>
                          <span style={{marginLeft: 'auto'}}>...送信中</span>
                       </div>
                    :  ''
                }

                </div>
            ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend}/>
        </ChatContainer>
        </MainContainer>
    </div>
  );
}

