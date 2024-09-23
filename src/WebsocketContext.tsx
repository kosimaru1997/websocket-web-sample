import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // 接続状態を管理
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const maxReconnectAttempts = 3; // 最大再接続試行回数
    const reconnectInterval = 2000; // 再接続の間隔（ミリ秒）

    useEffect(() => {
        const connect = () => {
            if (isConnected) return; // すでに接続されている場合は何もしない

            const newSocket = new WebSocket(
                import.meta.env.VITE_WEBSOCKET_URL
            );

            // 接続時の処理
            newSocket.addEventListener("open", (event) => {
                console.log('connection start');
                setIsConnected(true); // 接続状態を更新
                // 5分ごとにメッセージを送信
                const intervalId = setInterval(() => {
                    newSocket.send(JSON.stringify('test'));
                    console.log('Sent initial message again');
                }, 5 * 60 * 1000); // 5分（300000ミリ秒）

                // クリーンアップ関数でインターバルをクリア
                newSocket.addEventListener("close", () => {
                    clearInterval(intervalId);
                });
            });

            // 切断時の処理
            newSocket.addEventListener("close", (event) => {
                console.log('connection closed');
                setIsConnected(false); // 接続状態を更新
                if (reconnectAttempts < maxReconnectAttempts) {
                    setReconnectAttempts(prev => prev + 1);
                    console.log(`Attempting to reconnect... (${reconnectAttempts + 1})`);
                    setTimeout(connect, reconnectInterval); // 再接続を試みる
                } else {
                    console.error('Max reconnect attempts reached. Giving up.');
                }
            });

            setSocket(newSocket);

            // クリーンアップ関数
            return () => {
                console.log('connection closed on unmounted');
                newSocket.close(); // アンマウント時に接続を切断
                setIsConnected(false); // 接続状態をリセット
            };
        };

        connect(); // 初回接続を試みる

    }, [reconnectAttempts, isConnected]); // isConnectedを依存配列に追加

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

// WebSocketを使用するためのカスタムフック
export const useWebSocket = () => {
    return useContext(WebSocketContext);
};