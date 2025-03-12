import io from 'socket.io-client';

let socket = null;

export const getSocket = () => {

    if (!socket) {
        // 소켓 객체가 초기화되지 않았을 경우 초기화
        socket = io('http://localhost:8095', {
            transports: ['websocket'], // WebSocket만 사용
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
