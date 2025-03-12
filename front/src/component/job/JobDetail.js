import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs"; // ✅ STOMP 사용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faGraduationCap,
  faUniversity,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faUserFriends,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import ProgramSideBar from "./ProgramSideBar"; // ✅ 사이드바 추가
import "./styles/JobDetail.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const JobDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [showMoreSummary, setShowMoreSummary] = useState(false);
  const [userId, setUserId] = useState(null); // ✅ 로그인한 사용자 ID 저장

  /**
   * ✅ 로그인한 사용자 ID 가져오기
   */
  const fetchUserId = async () => {
    const token = localStorage.getItem("accessToken"); // ✅ 수정: accessToken으로 가져옴

    console.log("📌 현재 저장된 JWT 토큰:", token);

    if (!token) {
      console.error("🚨 로그인이 필요합니다. (토큰 없음)");
      alert("🚨 로그인 후 다시 시도해주세요.");
      navigate("/login");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8090/users/info", {
        headers: { "Authorization": `Bearer ${token}` },
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

      setUserId(data.userId);
      return data.userId;
    } catch (error) {
      console.error("🚨 사용자 정보를 불러오는 중 오류 발생:", error);
      return null;
    }
  };

  /**
   * ✅ 프로그램 상세 정보 가져오기
   */
  const fetchProgramDetail = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8090/api/programs/${programId}`);
      if (!response.ok) throw new Error("프로그램 데이터를 불러오지 못했습니다.");
      const data = await response.json();
      setProgram(data);

      // ✅ 신청 여부 확인
      if (data.applicants?.includes(userId)) {
        setIsApplied(true);
      }
    } catch (error) {
      console.error("🚨 프로그램 상세 데이터 로드 오류:", error);
    }
  };

  useEffect(() => {
    fetchUserId().then((id) => {
      if (id) fetchProgramDetail(id);
    });

    // ✅ 로그인한 사용자만 WebSocket 연결
    if (!userId) return;

    // ✅ STOMP WebSocket 연결
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe("/topic/programs", (message) => {
          const updatedProgram = JSON.parse(message.body);
          if (updatedProgram.id === Number(programId)) {
            setProgram(updatedProgram);
          }
        });
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류:", frame);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [programId, userId]); // ✅ WebSocket 연결 시 userId 체크

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short" };
    const dayName = new Intl.DateTimeFormat("ko-KR", options).format(date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}(${dayName})`;
  };

  const handleScheduleSelect = (index) => {
    setSelectedSchedules((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

    /**
   * ✅ 프로그램 신청 기능 (JWT 인증 적용)
   */
    const handleApply = async () => {
    if (!userId) {
      alert("⚠ 로그인이 필요합니다.");
      return;
    }

    if (isApplied) {
      alert("⚠ 이미 신청한 프로그램입니다.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); // ✅ 수정

      const response = await fetch(`http://localhost:8090/api/programs/applications/${programId}/apply`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // ✅ userId 추가
      });

      if (!response.ok) {
        const responseText = await response.text();
        alert(`🚨 신청 실패: ${responseText}`);
        throw new Error(`🚨 신청 오류 (HTTP ${response.status}): ${responseText}`);
      }

      alert("✅ 신청이 완료되었습니다!");
      setIsApplied(true);
      navigate("/programs");
    } catch (error) {
      console.error("🚨 신청 처리 중 오류 발생:", error);
      alert("🚨 네트워크 오류 또는 서버 문제로 인해 신청할 수 없습니다. 다시 시도해 주세요.");
    }
  };


  // 링크 복사 기능
const handleCopyLink = () => {
  const programUrl = window.location.href;
  navigator.clipboard.writeText(programUrl)
    .then(() => alert("링크가 복사되었습니다!"))
    .catch(err => console.error("링크 복사 실패:", err));
};

// 카카오톡 공유 기능
const shareOnKakao = () => {
  if (!window.Kakao) {
    alert("카카오 SDK가 로드되지 않았습니다.");
    return;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init("c475a908f7e0e67cdde41a0d8767639d"); // ✅ 여기에 본인의 카카오 JavaScript 키 입력
  }

  window.Kakao.Link.sendDefault({
    objectType: "feed",
    content: {
      title: program?.name || "프로그램 정보",
      description: "이 프로그램을 확인해보세요!",
      imageUrl: program?.imageUrl ? `http://localhost:8090/api/programs/images/${program.imageUrl}` : "https://via.placeholder.com/150",
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href
      }
    }
  });
};


useEffect(() => {
  // localStorage에서 최신 즐겨찾기 상태 불러오기
  const savedFavorite = JSON.parse(localStorage.getItem(`favorite_${programId}`)) || false;
  setIsFavorited(savedFavorite);
  setFavoriteCount(savedFavorite ? 1 : 0);
}, [programId]);

// 즐겨찾기 토글
const toggleFavorite = async () => {
  const newFavoriteStatus = !isFavorited;
  setIsFavorited(newFavoriteStatus);
  setFavoriteCount(newFavoriteStatus ? 1 : 0);

  localStorage.setItem(`favorite_${programId}`, JSON.stringify(newFavoriteStatus));

  // 서버에도 반영
  try {
    const response = await fetch("http://localhost:8090/api/favorites/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        programId: programId,
      }),
    });

    if (!response.ok) {
      alert("즐겨찾기 상태 저장 실패");
    } else {
      console.log("즐겨찾기 상태 서버에 저장됨");
    }
  } catch (error) {
    console.error("서버와의 연결 오류:", error);
  }

  // 모든 곳에서 반영되도록 이벤트 발생
  window.dispatchEvent(new Event("storage"));
};

const toggleShowMoreSummary = () => {
  setShowMoreSummary(!showMoreSummary);
};
  

return (

  <div className="job-detail-layout">
  {/* ✅ 사이드바 추가 */}
  <ProgramSideBar />

  <div className="job-detail-container">
    {program ? (
      <>
        {/* Header Section */}
        <div className="job-detail-header">
          <div className="job-detail-image-container">
            {program.imageUrl ? (
              <img
                src={`http://localhost:8090/api/programs/images/${program.imageUrl}`}
                alt={program.name}
                className="job-detail-image"
              />
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>

          <div className="job-detail-info-container">

            {/* 공유 버튼 그룹 */}
           <div className="job-detail-share-buttons">
              {/* 제목 */}
              <h1 className="job-detail-title">{program.name}</h1>
              {/* 링크 복사 */}
              <button className="job-detail-share-btn" onClick={handleCopyLink}>
                <img src="/assets/link-icon.png" alt="링크 복사" className="link-icon" /> URL
              </button>

              {/* 카카오톡 공유 */}
              <button className="job-detail-kakao-btn" onClick={shareOnKakao}>
                <img src="/assets/kakao-icon.png" alt="카카오톡 공유" className="kakao-icon" /> kakao
              </button>
            </div>

            <div className="job-detail-divider"></div>

            <div className="job-detail-details">
              <p>
                <FontAwesomeIcon icon={faUsers} className="job-detail-icon" />
                <strong> 모집대상:</strong> {program.target || "모집 대상 없음"}
              </p>
              <p>
                <FontAwesomeIcon icon={faGraduationCap} className="job-detail-icon" />
                <strong> 학년/성별:</strong> {program.gradeGender || "정보 없음"}
              </p>
              <p>
                <FontAwesomeIcon icon={faUniversity} className="job-detail-icon" />
                <strong> 학과:</strong> {program.department || "학과 정보 없음"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="job-detail-bottom-section">
          <div className="job-detail-poster-info">
            <p>
              <strong>{program.posterName}</strong>
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="job-detail-icon" />
              <span> {program.posterEmail || "이메일 정보 없음"}</span>
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="job-detail-icon" />
              <span> {program.posterPhone || "전화번호 정보 없음"}</span>
            </p>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="job-detail-icon" />
              <span> {program.posterLocation || "위치 정보 없음"}</span>
            </p>

            {/* 프로그램 간단한 설명 */}
            <div className={`job-detail-program-summary ${showMoreSummary ? "job-detail-expanded" : ""}`}>
              {program.description || "프로그램 설명이 없습니다."}
            </div>
            <div className="job-detail-show-more-summary-button" onClick={toggleShowMoreSummary}>
              {showMoreSummary ? "간단히" : "더보기"}
            </div>
          </div>

         {/* 일정 Section */}
        <div className="job-detail-description">
          <h3 className="job-detail-schedule-title"></h3>
          <div className="job-detail-schedule-scrollable">
            {program.schedules && program.schedules.length > 0 ? (
              program.schedules.map((schedule, index) => (
                <div key={index} className="job-detail-schedule-group">
                  {/* ✅ 체크박스를 schedule name과 같은 높이로 정렬 */}
                  <div className="job-detail-schedule-header">
                    <input
                      type="checkbox"
                      checked={selectedSchedules.includes(index)}
                      onChange={() => handleScheduleSelect(index)}
                      className="job-detail-schedule-checkbox"
                    />
                    <h4 className="job-detail-schedule-name">{schedule.scheduleName}</h4>
                  </div>
                  <p>
                    <FontAwesomeIcon icon={faCalendarAlt} className="job-detail-icon" />
                    날짜: {getFormattedDate(schedule.date)}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faUserFriends} className="job-detail-icon" />
                    최대 신청자: {schedule.maxApplicants}명
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faCheckCircle} className="job-detail-icon" />
                    상태: {schedule.status}
                  </p>
                  {index < program.schedules.length - 1 && <hr className="job-detail-schedule-divider" />}
                </div>
              ))
            ) : (
              <p>일정 정보가 없습니다.</p>
            )}
          </div>
        </div>
        </div>

        {/* 신청 버튼 & 찜 기능 */}
        <div className="job-detail-action-buttons">
          <button
            className="job-detail-apply-button"
            onClick={handleApply}
            disabled={isApplied || program.currentParticipants >= program.maxParticipants}
          >
            {isApplied ? "신청 완료" : program.currentParticipants >= program.maxParticipants ? "마감됨" : "신청하기"}
          </button>
          <div className="job-detail-favorite-container" onClick={toggleFavorite}>
            <i
              className={`bi ${
                isFavorited ? "bi-star-fill text-warning" : "bi-star"
              } program-view-favorite-icon`}
            ></i>
            <span className="job-detail-favorite-count">{favoriteCount}</span>
          </div>
        </div>
      </>
    ) : (
      <p>프로그램 정보를 불러올 수 없습니다.</p>
    )}
  </div>
  </div>
);
};

export default JobDetail;