import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket, disconnectSocket } from '../../../hooks/socket'; // 전역 소켓 관리
import UserRequestHandler from './UserRequestHandler';
import './css/ChatRoom.css';
import { LoginContext } from '../../../../login/security/contexts/LoginContextProvider';
import useIsAdmin from '../../../hooks/useIsAdmin';

const ChatRoom = () => {
    const { roomId } = useParams(); // URL에서 roomId 가져오기
    const [messages, setMessages] = useState([]);
    const [isAutoScroll, setIsAutoScroll] = useState(true); // 자동 스크롤 여부
    const messagesContainerRef = useRef(null); // 채팅창 컨테이너 참조
    const [inputMessage, setInputMessage] = useState('');
    const { isName } = useContext(LoginContext);
    const isAdmin = useIsAdmin();
    // 초기화 시에만 로컬 스토리지에서 userName을 가져옴
    const initialUserName = isName || 'Guest';
    const [userName] = useState(initialUserName); // 이후 변경되지 않도록 고정

    const navigate = useNavigate();

    const socketRef = useRef(null);

    const scrollToBottom = () => {
        if (isAutoScroll && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    // 사용자가 스크롤했는지 확인하는 함수
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;

        // 사용자가 맨 아래에 있는지 확인 (여유값 10px)
        const atBottom = scrollHeight - scrollTop - clientHeight <= 10;
        setIsAutoScroll(atBottom); // 맨 아래에 있으면 자동 스크롤 활성화
    };

    useEffect(() => {
        scrollToBottom(); // 메시지가 변경될 때마다 실행
    }, [messages]);

    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;


        // 메시지 수신 이벤트
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // 대기 중 메세지 수신
        socket.on('waitingAccept', (message) => {
            setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
        });

        // 시스템 메시지 수신
        socket.on('systemMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
        });

        // 연결끊김 메시지 수신
        socket.on('userDisconnected', (message) => {
            setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
        });

        // 에러 처리
        socket.on('error', (error) => {
            console.error('Error:', error.message);
        });

        // 컴포넌트 언마운트 시 소켓 및 리스너 정리
        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveRoom', { roomId, userName });
                socketRef.current.off('receiveMessage');
                disconnectSocket();
            }
        };
    }, [roomId, userName]);

    useEffect(() => {
        // 방 종료 시 처리
        socketRef.current.on('roomEnded', () => {
            alert('상담이 종료되었습니다. 메인 페이지로 이동합니다.');

            if (isAdmin) {
                navigate('/counsel/realtime/dashboard')
            }
            else {
                navigate('/counsel');
            }
        });

        return () => {
            socketRef.current.off('roomEnded');
        };
    }, [navigate]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const messageData = { roomId, sender: userName, message: inputMessage };
            socketRef.current.emit('sendMessage', messageData);
            setInputMessage('');
        }
    };

    const handleEndRoom = () => {
        if (window.confirm('정말로 상담을 종료하시겠습니까?')) {
            // 서버에 방 종료 요청
            socketRef.current.emit('endRoom', { roomId });
        }
    };

    return (
        <div className="chat-room">
            <UserRequestHandler />
            <h1 className='font-bold'>실시간 채팅</h1>

            {/* 채팅창 */}
            <div className="chat-messages"
                onScroll={handleScroll}
                ref={messagesContainerRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === userName ? 'mine' : 'other'}`}
                    >
                        <span className="sender">{msg.sender}</span>
                        <span className="message-color">{msg.message}</span>
                    </div>
                ))}
            </div>

            {/* 채팅 입력/전송 */}
            <form className="message-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button type="submit">전송</button>
                {/* 방 종료 버튼 */}
                {isAdmin && <button className="end-room-button" onClick={handleEndRoom}>
                    상담 종료
                </button>}
            </form>
        </div>
    );
};

export default ChatRoom;
