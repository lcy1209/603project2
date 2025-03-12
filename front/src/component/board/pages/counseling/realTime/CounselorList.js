import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../../login/security/contexts/LoginContextProvider";
import "./css/CounselorList.css";
import { SERVER_URL } from "../../../api/serverURL";
import { disconnectSocket, getSocket } from "../../../hooks/socket";
import useIsAdmin from "../../../hooks/useIsAdmin";

const realtimeDescription = "상담 가능 시간은 09:00 ~ 18:00 까지 입니다.\n상태 업데이트 버튼을 눌러서 상담사의 상태를 업데이트 할 수 있습니다.";

const CounselorList = () => {
    const navigate = useNavigate();
    const { isUserId, isName } = useContext(LoginContext); // 로그인 정보
    const [counselors, setCounselors] = useState([]); // 상담사 목록
    const [statuses, setStatuses] = useState({});
    const isAdmin = useIsAdmin();

    useEffect(() => {
        // 상담사 목록 가져오기 (예: API 호출)
        fetch(`${SERVER_URL}/api/counselors`)
            .then((res) => res.json())
            .then((data) => setCounselors(data))
            .catch((err) => console.error("Error fetching counselors:", err));

        // 상담사 상태 가져오기
        fetch("http://localhost:8095/api/counselorStatuses")
            .then((res) => res.json())
            .then((data) => {
                setStatuses(data);
                console.log("상담사 상태 데이터:", data);
            }) // 상담사 상태 저장
            .catch((err) => console.error("Error fetching counselor statuses:", err));

        disconnectSocket();
    }, []);

    const handleChatStart = (counselorName) => {
        const socket = getSocket();

        // 상담 요청 전송
        socket.emit(
            "requestCounseling",
            { userId: isUserId, userName: isName, counselorName },
            ({ roomId, error }) => {
                if (error) {
                    console.error("상담 요청 실패:", error);
                    return;
                }

                navigate(`/counsel/realtime/chat/${roomId}`); // 채팅방으로 이동
            }
        );
    };

    return (
        <div className="counselor-list-container">
            <h1 className="font-bold">실시간 상담사 목록</h1>
            {/* <p>상담 가능 시간은 09:00 ~ 18:00 까지 입니다.</p> */}
            <div className="counselor-list-top">
                <p>{realtimeDescription}</p>
                <button
                    className="refresh-button"
                    onClick={() => window.location.reload()}
                >
                    ↺ 상태 업데이트
                </button>
            </div>
            <div className="counselor-grid">
                {counselors.map((counselor) => (
                    <div key={counselor.id} className="counselor-card">
                        <h3>{counselor.name}</h3>
                        <p className="info">{counselor.info}</p>
                        <p className="experience">경력: {counselor.experience}</p>
                        {(statuses[counselor.name] === "busy") &&
                            <button
                                className={`chat-button ${statuses[counselor.name]}`}
                                disabled
                                onClick={() => handleChatStart(counselor.name)}
                            >
                                상담 중..
                            </button>}
                        {(statuses[counselor.name] === "offline" || statuses[counselor.name] === undefined) &&
                            <button
                                className={`chat-button ${statuses[counselor.name]}`}
                                disabled
                                onClick={() => handleChatStart(counselor.name)}
                            >
                                오프라인
                            </button>}
                        {(statuses[counselor.name] === "available") &&
                            <button
                                className={`chat-button ${statuses[counselor.name]}`}
                                onClick={() => handleChatStart(counselor.name)}
                            >
                                상담 하기
                            </button>}
                    </div>
                ))}
            </div>
            {isAdmin && <button className="realtime-dashboard" onClick={() => navigate("/counsel/realtime/dashboard")}>
                dashboard
            </button>}
        </div>
    );
};

export default CounselorList;
