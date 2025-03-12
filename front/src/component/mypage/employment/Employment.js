import React, { useState, useEffect } from 'react';
import './Employment.css';
import Sidebar from '../page/Sidebar';
import { Search, AlertCircle } from "lucide-react"; // 🔍 돋보기 + ❗ 경고 아이콘 추가
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as lucideReact from "lucide-react";

const Employment = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [removingItems, setRemovingItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태 추가
    const [filteredData, setFilteredData] = useState([]); // ✅ 검색된 데이터 저장


    const [jobData, setJobData] = useState({
        tab1: [], tab2: [], tab3: [],
    });

    useEffect(() => {
        const removeExpiredJobs = () => {
            setJobData((prevJobData) => {
                const updatedJobData = { ...prevJobData };
                let dataChanged = false;

                Object.keys(updatedJobData).forEach((tab) => {
                    const filteredData = updatedJobData[tab].filter((job) => {
                        const deadlineDate = new Date(job.deadline);
                        const today = new Date();
                        const daysDiff = Math.ceil((today - deadlineDate) / (1000 * 60 * 60 * 24));

                        return daysDiff <= 2; // 마감일이 2일 이상 지난 항목 삭제
                    });

                    if (filteredData.length !== updatedJobData[tab].length) {
                        dataChanged = true;
                        updatedJobData[tab] = filteredData;
                    }
                });

                return dataChanged ? updatedJobData : prevJobData;
            });
        };

        removeExpiredJobs(); // 처음 렌더링될 때 한 번 실행
        const interval = setInterval(removeExpiredJobs, 24 * 60 * 60 * 1000); // 24시간마다 실행

        return () => clearInterval(interval);
    }, []);

    const sortByDeadline = (data) => [...data].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // 검색어 필터링 추가
    const paginateData = () => {
        const dataToPaginate = searchQuery.trim() ? filteredData : jobData[activeTab] || [];
        const sortedData = sortByDeadline(dataToPaginate); // 마감일 기준 정렬

        // 전체 페이지 수 계산
        const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

        // 현재 페이지가 totalPages보다 크지 않도록 보정
        const validCurrentPage = Math.min(currentPage, totalPages);

        // 페이지별 데이터 정확하게 슬라이싱
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        console.log("🚀 startIndex:", startIndex, "endIndex:", endIndex, "currentPage:", validCurrentPage);

        return sortedData.slice(startIndex, endIndex);
    };

    const totalItems = searchQuery.trim() ? filteredData.length : jobData[activeTab]?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // ⭐ 즐겨찾기 해제 시 즉시 삭제 + 현재 페이지가 비면 이전 페이지로 이동 + 탭 유지
    const toggleFavorite = (jobId) => {
        setRemovingItems((prev) => [...prev, jobId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== jobId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 🔥 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 🔥 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
                if (remainingItemsOnPage.length === 0 && currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }

                return updatedJobData;
            });

            setRemovingItems((prev) => prev.filter((id) => id !== jobId));
        }, 500);
    };

    // ⭐ 즐겨찾기 해제 시 즉시 삭제 + 현재 페이지가 비면 이전 페이지로 이동 + 탭 유지
    const toggleCpFavorite = (jobId) => {
        setRemovingItems((prev) => [...prev, jobId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== jobId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 🔥 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 🔥 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
                if (remainingItemsOnPage.length === 0 && currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }

                return updatedJobData;
            });

            setRemovingItems((prev) => prev.filter((id) => id !== jobId));
        }, 500);
    };

    // 탭 변경 시 실행되는 함수
    const handleTabChange = (tab) => {
        if (tab !== activeTab) {  // 현재 탭과 다를 때만 실행 (불필요한 렌더링 방지)
            setActiveTab(tab);
        }
    };

    // 검색어 입력 처리 및 검색 후 데이터 저장
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === "") {
            // ✅ 검색어가 없을 때 → 기존 activeTab 데이터 사용
            setFilteredData([]);
        } else {
            // ✅ 검색어가 있을 때 → 모든 탭의 데이터에서 검색
            const allData = Object.values(jobData).flat();
            const results = allData.filter((job) =>
                job.company.toLowerCase().includes(query) ||
                job.details.toLowerCase().includes(query) ||
                job.education.toLowerCase().includes(query)
            );

            setFilteredData(results); // ✅ 검색된 데이터 저장
        }

        setCurrentPage(1); // ✅ 검색 시 첫 번째 페이지로 이동
    };


    // 추천 채용 즐겨찾기
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8090/api/favorites/my-favorites", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then((response) => {
                setFavorites(response.data);

                // ✅ 추천 채용 (`tab2`)에 즐겨찾기 목록 추가
                setJobData((prevJobData) => ({
                    ...prevJobData,
                    tab2: response.data.map((job) => ({
                        id: job.id,
                        title: job.title,
                        regTime: job.regTime,
                        writerName: job.writerName,
                        count: job.count,
                        isFavorite: true, // ⭐ 즐겨찾기 상태
                    }))
                }));
            })
            .catch((error) => {
                console.error("즐겨찾기 목록을 불러오는 중 오류 발생:", error);
            });
    }, []);


    // 교내 채용 즐겨찾기
    const [cpFavorites, setCpFavorites] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8090/api/cp-favorites/my-favorites", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then((response) => {
                setCpFavorites(response.data);

                // ✅ 교내 채용 (`tab1`)에 즐겨찾기 목록 추가
                setJobData((prevJobData) => ({
                    ...prevJobData,
                    tab1: response.data.map((job) => ({
                        id: job.id,
                        title: job.title,
                        writerName: job.writerName,
                        regTime: job.regTime,
                        count: job.count,
                        isFavorite: true, // ⭐ 즐겨찾기 상태
                    }))
                }));
            })
            .catch((error) => {
                console.error("교내 채용 즐겨찾기 목록을 불러오는 중 오류 발생:", error);
            });
    }, []);

    // 외부 채용 즐겨찾기
    const [eventFavorites, setEventFavorites] = useState([]);


    // ✅ 외부 채용 (tab3) 데이터 가져오기
    // 📌 외부 채용 즐겨찾기 목록 가져오기
    useEffect(() => {
        axios.get("http://localhost:8090/api/work-favorites", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then((response) => {
                setEventFavorites(response.data);

                setJobData((prevJobData) => ({
                    ...prevJobData,
                    tab3: response.data.map((job) => ({
                        id: job.eventNo,
                        title: job.title,
                        eventTerm: job.eventTerm,
                        startDate: job.startDate,
                        endDate: job.endDate,
                        area: job.area,
                        isFavorite: true,
                    }))
                }));
            })
            .catch((error) => {
                console.error("❌ 외부 채용 즐겨찾기 목록 불러오기 오류:", error);
            });
    }, []);





    // ✅ 외부 채용 즐겨찾기 추가/삭제 함수
    const toggleEventFavorite = (eventId) => {
        setRemovingItems((prev) => [...prev, eventId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== eventId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 🔥 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 🔥 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
                if (remainingItemsOnPage.length === 0 && currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }

                return updatedJobData;
            });

            setRemovingItems((prev) => prev.filter((id) => id !== eventId));
        }, 500);
    };
    // 추천 게시글 상세 페이지 이동
    const onDetail = (suggestBoard) => {
        axios.put(`http://localhost:8090/api/suggest/board/${suggestBoard.id}/count`)
            .then(() => {
                navigate(`/suggest_board/SuggestBoarddetail/${suggestBoard.id}`, { state: { ...suggestBoard } }); // 수정된 경로
            })
            .catch((error) => {
                console.error("조회수 증가 중 오류 발생:", error);
            });
    };

    // 교내 게시글 상세 페이지 이동
    const onDetail2 = (board) => {
        axios.put(`http://localhost:8090/api/campus/board/${board.id}/count`) // 조회수 증가
            .then(() => {
                navigate(`/campus_board/CampusBoardDetail/${board.id}`); // 수정된 경로
            })
            .catch((error) => {
                console.error("조회수 증가 중 오류 발생:", error);
            });
    };

    return (
        <div>
            <div className="emp-container">
                <main className="emp-main">
                    <Sidebar />
                    <section className="emp-form-container">
                        <h2>나의 채용 정보</h2>
                        <div className="emp-division-line"></div>

                        {/* 검색 입력창 추가 */}
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

                        {/* 검색 중이 아닐 때만 탭 표시 */}
                        {/* 검색 중이 아니면서, 데이터가 있는 탭만 표시 */}
                        {!searchQuery.trim() && Object.values(jobData).some(tabData => tabData.length > 0) && (
                            <ul className="emp-tabs">
                                {Object.keys(jobData).filter(tab => jobData[tab].length > 0).map((tab) => (
                                    <li key={tab}
                                        className={`emp-tab ${activeTab === tab ? "active" : ""}`}
                                        onClick={() => handleTabChange(tab)}>
                                        {tab === "tab1" ? "교내 채용" : tab === "tab2" ? "추천 채용" : "외부 채용"}
                                    </li>
                                ))}
                            </ul>
                        )}


                        {/* 검색 결과가 없을 때 메시지 & 아이콘 표시 */}
                        {totalItems === 0 ? (
                            <div className="no-data-message">
                                <AlertCircle className="no-data-icon" /> {/* 느낌표 아이콘 추가 */}
                                {searchQuery.trim() ? "검색한 결과가 없습니다" : "최근 즐겨찾기한 채용 정보가 없습니다"}
                            </div>
                        ) : activeTab === "tab1" ? (  // 교내 채용 
                            <table className="emp-table">
                                <thead>
                                    <tr>
                                        <th>즐겨찾기</th>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>작성일</th>
                                        <th>조회수</th>
                                    </tr>
                                </thead>

                                {/* 교내 채용 ('tab1') */}
                                <tbody>
                                    {paginateData().length > 0 ? (
                                        paginateData().map((job, index) => (
                                            <tr key={job.id}
                                                className={`emp-table ${removingItems.includes(job.id) ? "fade-out-left" : ""}`}
                                            >
                                                <td>
                                                    <span className="star" onClick={() => toggleCpFavorite(job.id)} style={{ cursor: 'pointer', color: 'gold' }}>
                                                        ⭐
                                                    </span>
                                                </td>
                                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="th-title" onClick={() => onDetail(job)}>{job.title}</td>
                                                <td>{job.regTime?.split('T')[0]}</td>
                                                <td>{job.count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>최근 추가한 교내 채용 데이터가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : activeTab === "tab2" ? (  // 추천 채용 
                            <table className="emp-table">
                                <thead>
                                    <tr>
                                        <th>즐겨찾기</th>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>작성일</th>
                                        <th>조회수</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginateData().length > 0 ? (
                                        paginateData().map((job, index) => (
                                            <tr key={job.id}
                                                className={`emp-table ${removingItems.includes(job.id) ? "fade-out-left" : ""}`}>
                                                <td>
                                                    <span className="star" onClick={() => toggleFavorite(job.id)} style={{ cursor: 'pointer', color: 'gold' }}>
                                                        ⭐
                                                    </span>
                                                </td>
                                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td>{job.title}</td>
                                                <td>{job.regTime?.split('T')[0]}</td>
                                                <td>{job.count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: "center" }}>추천 채용 데이터가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : activeTab === "tab3" ? (  // 외부 채용 
                            <table className="emp-table">
                                <thead>
                                    <tr>
                                        <th>즐겨찾기</th>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>채용 기간</th>
                                        <th>근무 지역</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginateData().length > 0 ? (
                                        paginateData().map((job, index) => (
                                            <tr key={job.id}
                                                className={`emp-table ${removingItems.includes(job.id) ? "fade-out-left" : ""}`}>
                                                <td>
                                                    <span className="star" onClick={() => toggleEventFavorite(job.id)} style={{ cursor: 'pointer', color: 'gold' }}>
                                                        ⭐
                                                    </span>
                                                </td>
                                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td>{job.title}</td>
                                                <td>{job.startDate} ~ {job.endDate}</td>
                                                <td>{job.area}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>외부 채용 데이터가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div> {/* 다른 탭의 컨텐츠 렌더링 가능 */}</div>
                        )}

                        {/* 페이지네이션 (2페이지 이상일 때만 표시) */}
                        {totalPages > 1 && (
                            <div className="emp-pagination">
                                {Array.from({ length: totalPages }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            className={currentPage === pageNum ? "active" : ""}
                                            onClick={() => {
                                                if (currentPage !== pageNum) {
                                                    setCurrentPage(pageNum);
                                                }
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Employment;
