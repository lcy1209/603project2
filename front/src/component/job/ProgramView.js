import React, { useEffect, useState } from "react"; // React와 useState, useEffect 훅을 임포트
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅을 임포트
import { Client } from "@stomp/stompjs"; // WebSocket 연결을 위한 stompjs 클라이언트를 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome 아이콘을 임포트
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons"; // 신청 아이콘을 임포트

function ProgramView({ category }) { // category는 부모 컴포넌트로부터 전달받은 props
  const [programs, setPrograms] = useState([]); // 프로그램 목록을 저장하는 상태 변수
  const [viewMode, setViewMode] = useState("grid"); // 뷰 모드 상태 변수, 기본값은 "grid" (그리드 뷰)
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 변수
  const [sortOrder, setSortOrder] = useState("latest"); // 프로그램 정렬 기준 상태 변수 (최신순, 종료임박순, 인기순)
  const programsPerPage = 6; // 한 페이지당 표시할 프로그램 수
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  useEffect(() => {
    const stompClient = new Client({ // WebSocket 클라이언트 설정
      brokerURL: "ws://localhost:8090/ws", // WebSocket 서버 URL 설정
      onConnect: () => { // WebSocket 연결 성공 시 실행되는 콜백 함수
        console.log("WebSocket 연결 성공");
        stompClient.subscribe("/topic/programs", (message) => { // 프로그램 정보가 변경되면 이곳에서 처리
          try {
            const updatedProgram = JSON.parse(message.body); // 메시지 본문을 JSON으로 파싱
            setPrograms((prevPrograms) =>
              prevPrograms.map((program) =>
                program.id === updatedProgram.id ? updatedProgram : program // 변경된 프로그램 정보를 반영
              )
            );
          } catch (error) {
            console.error("WebSocket 메시지 처리 오류:", error); // 오류 처리
          }
        });
      },
    });

    stompClient.activate(); // WebSocket 연결 활성화
    fetchPrograms(); // 프로그램 데이터를 가져오는 함수 호출

    return () => stompClient.deactivate(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
  }, [category]); // category가 변경될 때마다 다시 프로그램 데이터를 불러옴

  // 선택된 카테고리에 맞는 프로그램 데이터를 가져오는 함수
  const fetchPrograms = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/programs"); // API에서 프로그램 목록 가져오기
      if (!response.ok) throw new Error("프로그램 데이터를 불러오는 데 실패했습니다.");
      const data = await response.json(); // 응답 데이터를 JSON으로 변환
  
      // 로컬 스토리지에서 즐겨찾기 여부 반영
      const updatedPrograms = data.map((program) => ({
        ...program,
        isFavorite: JSON.parse(localStorage.getItem(`favorite_${program.id}`) ?? "false"), // ✅ 저장된 즐겨찾기 정보 반영
      }));
  
      //  카테고리 필터링 적용
      const filteredPrograms = category === "전체"
        ? updatedPrograms
        : updatedPrograms.filter((program) => program.category === category);
  
      setPrograms(filteredPrograms);
    } catch (error) {
      console.error("프로그램 데이터 로드 오류:", error); // 데이터 로드 오류 처리
    }
  };

   // 즐겨찾기 토글 함수 (즐겨찾기 여부를 반영)
   const toggleFavorite = async (programId) => {
    const favoriteKey = `favorite_${programId}`;
    const currentStatus = JSON.parse(localStorage.getItem(favoriteKey)) || false;
    const newStatus = !currentStatus;
  
    // 로컬 스토리지에 새로운 상태 저장
    localStorage.setItem(favoriteKey, JSON.stringify(newStatus));
    console.log("localStorage 업데이트됨:", favoriteKey, newStatus);
  
    // 서버에 즐겨찾기 상태 변경 요청
    try {
      const response = await fetch("http://localhost:8090/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,  // 로그인된 유저의 ID
          programId: programId,  // 프로그램 ID
        }),
      });

      if (!response.ok) {
        throw new Error("즐겨찾기 상태 변경 실패");
      }
      console.log("즐겨찾기 상태 DB에 저장 완료");

    } catch (error) {
      console.error("서버와의 연결 실패:", error);
    }
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) =>
        program.id === programId ? { ...program, isFavorite: newStatus } : program
      )
    );
    // 모든 곳에서 반영되도록 이벤트 발생
    window.dispatchEvent(new Event("storage"));
  };

  // 프로그램 상세보기 페이지로 이동하는 함수
  const handleViewDetails = (programId) => {
    navigate(`/programs/${programId}`); // 해당 프로그램 ID로 상세보기 페이지 이동
  };

  // 날짜 포맷 함수: 날짜 문자열을 "yyyy.MM.dd(요일)" 형식으로 변환
  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekDay = date.toLocaleDateString("ko-KR", { weekday: "short" });
    return `${year}.${month}.${day}(${weekDay})`; // "yyyy.MM.dd(요일)" 형식 반환
  };

  // 프로그램 정렬 함수 (최신순, 종료임박순, 인기순)
  const sortedPrograms = [...programs].sort((a, b) => {
    if (sortOrder === "endingSoon") {
      return new Date(a.endDate) - new Date(b.endDate); // 종료일 기준으로 정렬
    } else if (sortOrder === "popular") {
      return b.maxParticipants - a.maxParticipants; // 참가자 수 기준으로 정렬
    } else {
      return new Date(b.startDate) - new Date(a.startDate); // 시작일 기준으로 정렬
    }
  });

  const totalPages = Math.ceil(sortedPrograms.length / programsPerPage); // 총 페이지 수 계산
  const startIndex = (currentPage - 1) * programsPerPage; // 현재 페이지에 표시할 프로그램의 시작 인덱스
  const currentPrograms = sortedPrograms.slice(startIndex, startIndex + programsPerPage); // 현재 페이지에 표시할 프로그램들

  // 페이지 번호 변경 함수
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) { // 유효한 페이지 번호일 경우에만 상태 업데이트
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="program-view-container">
      <div className="program-view-sorting-section d-flex flex-column align-items-end">
        <div className="d-flex align-items-center mb-2">
          {["endingSoon", "popular", "latest"].map((order) => ( // 정렬 옵션 목록
            <div className="form-check me-3 program-view-sort-option" key={order}>
              <input
                className="form-check-input program-view-sort-input"
                type="radio"
                name="sortOrder"
                id={`program-view-sortBy${order}`}
                value={order}
                onChange={() => setSortOrder(order)} // 정렬 기준이 변경될 때마다 상태 업데이트
                defaultChecked={order === "latest"}
              />
              <label className="form-check-label program-view-sort-label" htmlFor={`program-view-sortBy${order}`}>
                {order === "endingSoon" && "종료임박순"}
                {order === "popular" && "인기순"}
                {order === "latest" && "최신순"}
              </label>
            </div>
          ))}
        </div>

        {/* 그리드 뷰와 리스트 뷰 모드를 전환하는 아이콘 */}
        <div className="program-view-view-icons">
          <i className={`bi bi-grid ${viewMode === "grid" ? "program-view-active" : ""}`} onClick={() => setViewMode("grid")} title="그리드 보기"></i>
          <i className={`bi bi-list ${viewMode === "list" ? "program-view-active" : ""}`} onClick={() => setViewMode("list")} title="리스트 보기"></i>
        </div>
      </div>

      <p className="program-view-program-count">총 {programs.length}개</p>
      <div className="program-view-program-container">
        {viewMode === "grid" ? ( // 그리드 뷰
          <div className="program-view-program-grid">
            <div className="row">
              {currentPrograms.map((program) => ( // 현재 페이지에 해당하는 프로그램들만 그리드로 표시
                <div className="col-md-4 program-view-grid-item" key={program.id}>
                  <div className="card program-view-card" onClick={() => handleViewDetails(program.id)}>
                    {program.imageUrl && (
                      <img src={`http://localhost:8090/api/programs/images/${program.imageUrl}`} alt={program.name} className="program-view-card-img-top" />
                    )}
                    <div className="program-view-card-body">
                      <div className="d-flex justify-content-between align-items-center"></div>
                      <div className="program-view-grid-poster-container">
                        <span className="program-view-poster-name">{program.category}</span>
                        <i
                          className={`bi ${program.isFavorite ? "bi-star-fill text-warning" : "bi-star"} program-view-favorite-icon`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(program.id); // 즐겨찾기 상태를 변경
                          }}
                        ></i>
                      </div>
                      <h5 className="program-view-card-title">{program.name}</h5>
                      <p className="program-view-dates">
                        <FontAwesomeIcon icon={faClipboardCheck} className="program-view-apply-icon" /> 신청:{" "}
                        {formatDateWithDay(program.startDate)} ~ {formatDateWithDay(program.endDate)}
                      </p>
                      <div className="program-view-progress-bar-container">
                        <div className="program-view-progress-bar" style={{
                          width: `${program.maxParticipants > 0 ? (program.currentParticipants / program.maxParticipants) * 100 : 0}%`,
                        }}>
                          <span className="program-view-progress-text">
                            {program.maxParticipants > 0
                              ? `${Math.round((program.currentParticipants / program.maxParticipants) * 100)}%`
                              : "0%"}
                          </span>
                        </div>
                      </div>
                      <p className="program-view-participants">
                        현재 신청자: {program.currentParticipants}명 / 최대 {program.maxParticipants}명
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : ( // 리스트 뷰
          <ul className="program-view-program-list">
            {currentPrograms.map((program) => ( // 리스트 뷰에서 프로그램들을 나열
              <li
                className="program-view-list-item"
                key={program.id}
                onClick={() => handleViewDetails(program.id)}
              >
                <div className="program-view-list-poster-container">
                  <p className="program-view-poster-name">{program.posterName}</p>
                  <span className="program-view-date">
                    {formatDateWithDay(program.startDate)} ~ {formatDateWithDay(program.endDate)}
                  </span>
                </div>
                <h5 className="program-view-list-title">
                  {program.name}
                  <i
                    className={`bi ${program.isFavorite ? "bi-star-fill text-warning" : "bi-star"} program-view-favorite-icon`}
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 시 상세 페이지로 이동 방지
                      toggleFavorite(program.id);
                    }}
                  ></i>
                </h5>
                <div className="program-view-progress-bar-container">
                  <div className="program-view-progress-bar" style={{
                    width: `${program.maxParticipants > 0 ? (program.currentParticipants / program.maxParticipants) * 100 : 0}%`,
                  }}>
                    <span className="program-view-progress-text">
                      {program.maxParticipants > 0
                        ? `${Math.round((program.currentParticipants / program.maxParticipants) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
                <p className="program-view-participants">
                  현재 신청자: {program.currentParticipants} / 최대 {program.maxParticipants}명
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 페이지네이션 */}
      <nav className="program-view-pagination mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
          </li>
          {[...Array(totalPages).keys()].map((_, index) => ( // 페이지 번호 생성
            <li className={`page-item ${index + 1 === currentPage ? "active" : ""}`} key={index}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProgramView;