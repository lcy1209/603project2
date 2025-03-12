import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs"; // ✅ STOMP 클라이언트 사용
import ProgramSideBar from "./ProgramSideBar"; // ✅ 사이드바 추가
import "./styles/ApplicationsList.css";

function ApplicationsList() {
  const [applications, setApplications] = useState([]); // ✅ 신청 내역 저장
  const [userId, setUserId] = useState(null); // ✅ 로그인한 사용자 ID 저장
  const navigate = useNavigate();

  /**
   * ✅ 로그인한 사용자 ID 가져오기 (JWT 인증)
   */
  const fetchUserId = async () => {
    const token = localStorage.getItem("accessToken"); // ✅ 올바른 키 확인

    console.log("📌 현재 저장된 JWT 토큰:", token);

    if (!token) {
      console.error("🚨 로그인이 필요합니다. (토큰 없음)");
      alert("🚨 로그인 후 다시 시도해주세요.");
      navigate("/login");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8090/users/info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 /users/info 응답 상태:", response.status);

      if (response.status === 401) {
        console.error("🚨 인증 실패 (JWT 만료 또는 잘못된 토큰)");
        alert("🚨 세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        navigate("/login");
        return null;
      }

      if (!response.ok) {
        console.error("🚨 유저 정보를 가져올 수 없습니다.");
        return null;
      }

      const data = await response.json();
      console.log("📌 현재 로그인한 userId:", data.userId);

      setUserId(data.userId); // ✅ userId 상태 업데이트
      return data.userId;
    } catch (error) {
      console.error("🚨 사용자 정보를 불러오는 중 오류 발생:", error);
      return null;
    }
  };

  /**
   * ✅ 신청 내역 가져오기 (로그인된 사용자 기준)
   */
  const fetchApplications = async (userId) => {
    if (!userId) return;

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://localhost:8090/api/programs/mypage/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("신청 내역을 불러오지 못했습니다.");

      const data = await response.json();
      console.log("📌 API 응답 데이터 확인:", data);

      if (!Array.isArray(data)) {
        console.error("🚨 데이터 형식 오류! 배열이 아닙니다.");
        return;
      }

      setApplications(data);
    } catch (err) {
      console.error("🚨 데이터 가져오기 오류:", err);
    }
  };

  useEffect(() => {
    fetchUserId().then((id) => {
      if (id) fetchApplications(id);
    });

    // ✅ STOMP WebSocket 연결 설정
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      reconnectDelay: 5000, // ✅ 자동 재연결
      debug: (msg) => console.log("📌 STOMP Debug:", msg),
      onConnect: () => {
        console.log("📌 STOMP WebSocket 연결 성공!");

        stompClient.subscribe("/topic/programs", (message) => {
          console.log("📌 WebSocket 메시지 수신:", message.body);
          const updatedApplications = JSON.parse(message.body);

          if (Array.isArray(updatedApplications)) {
            setApplications((prevApplications) => {
              // ✅ 기존 신청 내역에 새로운 신청 내역을 추가
              const newApplications = updatedApplications.filter(
                (newApp) => !prevApplications.some((oldApp) => oldApp.id === newApp.id)
              );
              return [...prevApplications, ...newApplications];
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류:", frame);
      },
    });

    stompClient.activate(); // ✅ WebSocket 연결 시작

    return () => {
      stompClient.deactivate(); // ✅ 컴포넌트 언마운트 시 연결 해제
    };
  }, []);

  return (
    <div className="applications-layout"> {/* ✅ 전체 레이아웃 추가 */}
      <ProgramSideBar /> {/* ✅ 사이드바 추가 */}

      <div className="applications-content"> {/* ✅ 컨텐츠를 감싸는 div 추가 */}
        <div className="app-list-container">
          <div className="app-list-box">
            <h1 className="app-list-title">프로그램 신청 내역</h1>
            <div className="app-list-title-line"></div>
            <div className="app-list-info-container">
              <p className="app-list-info">총 {applications.length}건</p>
              <p className="app-list-description">상세보기를 클릭하시면 상세정보를 확인할 수 있습니다.</p>
            </div>
            <table className="app-list-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>신청자</th>
                  <th>기관명</th>
                  <th>프로그램명</th>
                  <th>교육 시작일</th>
                  <th>교육 종료일</th>
                  <th>접수상태</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app, index) => {
                    return (
                      <tr key={app.id}>
                        <td>{index + 1}</td>
                        <td>{app.userNames && app.userNames.join(", ") || "신청자 없음"}</td> {/* 여러 신청자 표시 */}
                        <td>{app.posterName || "기관 정보 없음"}</td>
                        <td>{app.programName || "프로그램 없음"}</td>
                        <td>{app.startDate || "날짜 없음"}</td>
                        <td>{app.endDate || "날짜 없음"}</td>
                        <td className="app-list-status-active">
                          {app.status === "APPLIED" ? "모집중" : "취소됨"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data-message">
                      신청 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationsList;