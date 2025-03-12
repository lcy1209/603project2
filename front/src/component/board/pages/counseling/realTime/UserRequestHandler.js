import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket, disconnectSocket } from '../../../hooks/socket';

const UserRequestHandler = () => {
    const navigate = useNavigate();
    const socket = getSocket();

    useEffect(() => {
        // 서버에서 'requestCanceled' 이벤트를 수신
        socket.on('requestCanceled', (data) => {
            // 사용자가 방에서 나가고 알림 표시
            alert(data.message || '다른 요청이 수락되었습니다.');
            socket.emit('leaveRoom', { roomId: data.roomId }); // 서버에 방 나가기 요청
            disconnectSocket(); // 소켓 연결 해제
            navigate('/counsel/realtime'); // 상담사 목록 페이지로 이동
        });

        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            socket.off('requestCanceled');
        };
    }, [navigate]);

    return null; // 해당 컴포넌트는 UI를 렌더링하지 않음
};

export default UserRequestHandler;
