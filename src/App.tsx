import { useState, useEffect } from 'react';
import './App.css';
// import { connectWebsocket } from './useWebsocketManager';

function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('closed')

  useEffect(() => {
    // connectWebsocket({setStatus, messages, setMessages})
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <>
      <h2>Websocket Message Here</h2>
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </>
  );
}

export default App;


    // WebSocketと接続
