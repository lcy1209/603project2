import React, { useMemo, useState, useEffect, useCallback } from 'react';
import './Program.css';
import Sidebar from '../page/Sidebar';
import { AlertCircle } from "lucide-react";
import * as lucideReact from "lucide-react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8090";

const Program = () => {
    const [removingItems, setRemovingItems] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // 검색된 데이터 저장
    const [programData, setProgramData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [favoritePrograms, setFavoritePrograms] = useState([]); // 즐겨찾기
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [userId, setUserId] = useState(null); // 로그인한 사용자 ID 저장
    const navigate = useNavigate();

    // 로그인한 사용자 ID 가져오기 (JWT 인증)
    const fetchUserId = useCallback(async () => {
        const token = localStorage.getItem("accessToken");

        console.log("📌 현재 저장된 JWT 토큰:", token);  // 토큰 확인

        if (!token || token === "null") {  // null 체크 추가
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
    }, [navigate]);

    useEffect(() => {
        fetchUserId().then((id) => {
            if (id) fetchFavoritePrograms(id);
        });
    }, [fetchUserId]); // 이제 의존성 배열을 넣어도 문제가 없음!

    // 즐겨찾기 목록 가져오기
    const fetchFavoritePrograms = async (userId) => {
        const token = localStorage.getItem("accessToken");  // API 요청 시 토큰 가져오기

        if (!token) {
            console.error("❌ 토큰이 없습니다. API 요청을 중단합니다.");
            return;
        }

        try {
            console.log(`📡 즐겨찾기 API 요청: /api/favorites/list?userId=${userId}`);

            const response = await axios.get(`/api/favorites/list?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },  // 토큰 포함!
            });

            console.log("📌 즐겨찾기 API 응답 상태:", response.status);
            console.log("📌 즐겨찾기 API 응답 데이터:", response.data);

            setFavoritePrograms(response.data);
        } catch (error) {

            if (error.response?.status === 401) {
                alert("🚨 로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("accessToken");  // 만료된 토큰 제거
                navigate("/login");
            }
        }
    };

    // 검색 필터 적용
    const filteredPrograms = useMemo(() => {
        if (!searchQuery.trim()) return favoritePrograms;

        const lowerCaseQuery = searchQuery.toLowerCase();

        return favoritePrograms.filter(program =>
            program.programName.toLowerCase().includes(lowerCaseQuery) ||
            (program.category?.toLowerCase() || "").includes(lowerCaseQuery) // 🛠️ category 예외 처리
        );
    }, [searchQuery, favoritePrograms]);

    //  검색 결과가 변경될 때 상태 업데이트 (검색이 적용되도록)
    useEffect(() => {
        setCurrentPage(1); // 검색어 또는 데이터가 바뀔 때 페이지를 1로 이동
    }, [filteredPrograms]);

    // 검색 결과에도 페이지네이션 적용
    const paginatedPrograms = useMemo(() => {
        if (!filteredPrograms || filteredPrograms.length === 0) return [];
    
        // 마감일 기준 정렬
        const sortedData = [...filteredPrograms].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
        // 현재 페이지의 데이터 슬라이싱
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedData.slice(startIndex, endIndex); // 페이지별 데이터 슬라이싱
    }, [filteredPrograms, currentPage]);
    
    // 전체 페이지 수 계산
    const totalPages = useMemo(() => {
        return Math.ceil(filteredPrograms.length / itemsPerPage); // 전체 페이지 수 계산
    }, [filteredPrograms]);

    // 즐겨찾기 토글 기능
    const toggleFavorite = async (programId) => {
        try {
            await axios.post("/api/favorites/toggle", { userId, programId });

            console.log(`📌 즐겨찾기 토글됨: programId=${programId}`);

            setRemovingItems((prev) => [...prev, Number(programId)]); // 🛠️ Number 변환

            setTimeout(() => {
                setFavoritePrograms((prevFavorites) =>
                    prevFavorites.some(({ programId: id }) => Number(id) === Number(programId))
                        ? prevFavorites.filter(({ programId: id }) => Number(id) !== Number(programId))
                        : [...prevFavorites, { programId: Number(programId) }]
                );

                setRemovingItems((prev) => prev.filter((id) => Number(id) !== Number(programId))); // 🛠️ Number 변환
            }, 500);

            fetchFavoritePrograms(userId);
        } catch (error) {
            console.error("❌ 즐겨찾기 토글 실패", error);
        }
    };

    // 검색 결과 변경 시 1페이지로 이동하는 useEffect 
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);

    // 검색어 입력 핸들러
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // 마감기한 지나면 자동으로 삭제
    useEffect(() => {
        const removeExpiredPrograms = () => {
            setFavoritePrograms((prevPrograms) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return prevPrograms.filter((program) => {
                    const endDate = new Date(program.endDate);
                    endDate.setHours(0, 0, 0, 0);

                    return endDate >= today; // 마감되지 않은 프로그램만 유지
                });
            });
        };
        removeExpiredPrograms(); // 마운트될 때 실행

        // 하루에 한 번씩 자동으로 실행되도록 설정
        const interval = setInterval(removeExpiredPrograms, 24 * 60 * 60 * 1000);

        return () => clearInterval(interval); // 언마운트 시 인터벌 제거
    }, [favoritePrograms]);

    //  D-Day 계산 함수
    const getDDay = (deadline) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (diff < 0) return "마감"; // 이미 지난 경우
        if (diff === 0) return "D-Day";
        return `D-${diff}`;
    };

     // 프로그램 상세보기 페이지 이동
  const handleViewDetails = (programId) => {
    navigate(`/programs/${programId}`); // 해당 프로그램 ID로 상세보기 페이지 이동
  };

    return (
        <div className="myprogram-container">
            <main className="myprogram-main">
                <Sidebar />
                <section className="myprogram-form-container">
                    <h2>나의 취업 프로그램</h2>
                    <div className="myprogram-division-line"></div>

                    {/* 검색바 */}
                    
                    <div className="search-container">
                        {/* 검색어 입력 */}
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        {/* 검색 아이콘 */}
                        <lucideReact.Search className="search-icon" />
                    </div >
            
                    <table className="myprogram-table">
                        {paginatedPrograms.length > 0 && (
                            <thead>
                                <tr>
                                    {/* 검색 중이 아닐 때만 "즐겨찾기" 컬럼 표시 */}
                                    {!searchQuery.trim() &&
                                        <th>즐겨찾기</th>}
                                    <th>카테고리</th>
                                    <th>프로그램</th>
                                    <th>정원</th>
                                    <th>마감</th>
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {paginatedPrograms.length === 0 ? (
                                <div className="no-data-message">
                                    <AlertCircle className="no-data-icon" /> {/* 느낌표 아이콘 추가 */}
                                    {searchQuery.trim() ? "검색한 결과가 없습니다" : "최근 즐겨찾기한 취업 프로그램이 없습니다"}
                                </div>
                            ) : (
                                paginatedPrograms.map((program) => (
                                    <tr key={program.id}
                                        className={`myprogram-table ${removingItems.includes(program.id) ? "fade-out-left" : ""}`}
                                        style={{ cursor: "pointer", textAlign: "center" }}
                                    >

                                        {/* 즐겨찾기 버튼 (검색 중이 아닐 때만 표시) */}
                                        {!searchQuery && (
                                            <td>
                                                <span className="myprogram-star"
                                                    onClick={() => toggleFavorite(program.id)}
                                                    style={{ cursor: 'pointer', textAlign: 'center', verticalAlign: 'middle' }}>
                                                    ⭐
                                                </span>
                                            </td>
                                        )}

                                        <td>{program.category}</td>
                                        <td onClick={() => handleViewDetails(program.programId)}>
                                            {program.programName}
                                        </td>
                                        <td>{program.maxParticipants}명</td>
                                        <td><span style={{ color: 'rgb(52, 31, 167)', fontWeight: 'bold', textAlign: 'center' }}>
                                                 {getDDay(program.endDate)}</span><br />
                                            <span style={{ fontSize: '13px', marginTop: '5px' }}>마감일: {program.endDate}</span>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* 페이지네이션 (2페이지 이상일 때만 표시) */}
                    {paginatedPrograms.length > 0 && totalPages > 1 && (
                        <div className="emp-pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div >
    );
};


export default Program; 
