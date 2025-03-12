import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../../hooks/socket'; // 새 전역 소켓 관리 방식
import './css/CounselorDashboard.css';
import { LoginContext } from '../../../../login/security/contexts/LoginContextProvider';

const CounselorDashboard = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const { isName } = useContext(LoginContext);
    const counselorName = isName;

    useEffect(() => {
        const socket = getSocket(); // 소켓 초기화
        socket.emit('dashboardOpen', counselorName); // 서버에 대시보드 접속 알림

        const handleCounselRequest = ({ userId, userName, roomId, counselorName }) => {
            // 로그인한 상담사와 요청 상담사가 일치하는 경우에만 요청 추가
            if (counselorName === isName) {
                setRequests((prev) => [...prev, { userId, userName, roomId }]);
            }
        };

        // 상담 요청 수신 이벤트 등록
        socket.on('counselRequest', handleCounselRequest);

        return () => {
            socket.off('counselRequest', handleCounselRequest); // 기존 리스너 제거
        };
    }, [isName]); // socket 의존성 추가

    const handleAccept = (roomId) => {
        const counselorName = isName;

        if (!roomId) {
            console.error('Room ID가 유효하지 않음');
            return;
        }

        console.log(`상담 수락: Room ID: ${roomId}, Counselor ID: ${counselorName}`); // 디버깅용 로그
        
        const socket = getSocket();
        
        socket.emit('acceptCounseling', { roomId, counselorName }); // 상담 수락 이벤트 전송
        
        socket.emit('startChat', counselorName);
        
        navigate(`/counsel/realtime/chat/${roomId}`); // 방으로 이동
        
    };

    return (
        <div className="counselor-dashboard-container">
            <h1>상담 요청 목록</h1>
            <div className="request-list">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.roomId} className="request-card">
                            <h3>{request.userName}님의 요청</h3>
                            <button
                                className="accept-button"
                                onClick={() => handleAccept(request.roomId)}
                            >
                                수락
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-requests">현재 대기 중인 상담 요청이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default CounselorDashboard;
