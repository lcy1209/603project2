import React, { useState, useEffect } from 'react';
import './Employment.css';
import Sidebar from '../page/Sidebar';
import { Search, AlertCircle } from "lucide-react";
import axios from 'axios';
import * as lucideReact from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Employment = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [removingItems, setRemovingItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [filteredData, setFilteredData] = useState([]); // 검색된 데이터 저장
    const navigate = useNavigate();

    const [searchOption, setSearchOption] = useState(() => {
            // sessionStorage에서 검색 옵션을 불러옵니다.
            const savedOptions = sessionStorage.getItem("searchOptions");
            return savedOptions ? JSON.parse(savedOptions) : {
                startDate: "",
                endDate: "",
                region: "",
                searchQuery: "",
            };
        });

    // 각 탭에 15개씩 데이터 추가 (페이지네이션 확인 가능)
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

    // 값이 있는 첫 번째 탭을 자동으로 선택
    useEffect(() => {
        const firstNonEmptyTab = Object.keys(jobData).find(tab => jobData[tab].length > 0);
        if (firstNonEmptyTab) {
            setActiveTab(firstNonEmptyTab);
        }
    }, [jobData]);

    const totalItems = searchQuery.trim()
        ? filteredData.length
        : Object.values(jobData).reduce((acc, tabData) => acc + tabData.length, 0);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); // 최소 1페이지 유지

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        }
    }, [totalPages, currentPage]);

    //  즐겨찾기 해제 시 즉시 삭제 + 현재 페이지가 비면 이전 페이지로 이동 + 탭 유지
    const toggleFavorite = (jobId) => {
        setRemovingItems((prev) => [...prev, jobId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== jobId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
                if (remainingItemsOnPage.length === 0 && currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }
                return updatedJobData;
            });

            setRemovingItems((prev) => prev.filter((id) => id !== jobId));
        }, 500);
    };

    // 즐겨찾기 해제 시 즉시 삭제 + 현재 페이지가 비면 이전 페이지로 이동 + 탭 유지
    const toggleCpFavorite = (jobId) => {
        setRemovingItems((prev) => [...prev, jobId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== jobId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
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

    // useEffect를 사용하여 activeTab이 변경될 때만 1페이지로 리셋
    useEffect(() => {
        if (currentPage !== 1) {  // 현재 페이지가 1이 아닐 때만 변경
            setCurrentPage(1);
        }
    }, [activeTab]);  // activeTab 변경 시 실행

    // 검색어 입력 처리 및 검색 후 데이터 저장
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    
        if (query.trim() === "") {
            setFilteredData([]); // 검색어가 없으면 원래 데이터 유지
        } else {
            const tabData = jobData[activeTab] || [];
            const results = tabData.filter((job) => {
                return (
                    job.title?.toLowerCase().includes(query) || // `?.` 사용하여 undefined 방지
                    job.writerName?.toLowerCase().includes(query) ||
                    job.regTime?.toLowerCase().includes(query)
                );
            });
            setFilteredData(results);
        }
        setCurrentPage(1); // 검색 시 첫 번째 페이지로 이동
    };

    // 교내 채용 ('tab1') 즐겨찾기
    const [cpFavorites, setCpFavorites] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8090/api/cp-favorites/my-favorites", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then((response) => {
                setCpFavorites(response.data);

                // 교내 채용 (`tab1`)에 즐겨찾기 목록 추가
                setJobData((prevJobData) => ({
                    ...prevJobData,
                    tab1: response.data.map((job) => ({
                        id: job.id,
                        title: job.title,
                        writerName: job.writerName,
                        regTime: job.regTime,
                        count: job.count,
                        isFavorite: true, // 즐겨찾기 상태
                    }))
                }));
            })
            .catch((error) => {
                console.error("교내 채용 즐겨찾기 목록을 불러오는 중 오류 발생:", error);
            });
    }, []);

    // 추천 채용 ('tab2') 즐겨찾기
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8090/api/favorites/my-favorites", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then((response) => {
                setFavorites(response.data);

                // 추천 채용 (`tab2`)에 즐겨찾기 목록 추가
                setJobData((prevJobData) => ({
                    ...prevJobData,
                    tab2: response.data.map((job) => ({
                        id: job.id,
                        title: job.title,
                        regTime: job.regTime,
                        writerName: job.writerName,
                        count: job.count,
                        isFavorite: true, // 즐겨찾기 상태
                    }))
                }));
            })
            .catch((error) => {
                console.error("즐겨찾기 목록을 불러오는 중 오류 발생:", error);
            });
    }, []);

    // 외부 채용 ('tab3') 즐겨찾기
    const [eventFavorites, setEventFavorites] = useState([]);

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

    // 즐겨찾기 추가/삭제 함수
    const toggleEventFavorite = (eventId) => {
        setRemovingItems((prev) => [...prev, eventId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== eventId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
                if (remainingItemsOnPage.length === 0 && currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }

                return updatedJobData;
            });
            setRemovingItems((prev) => prev.filter((id) => id !== eventId));
        }, 500);
    };

    // 교내 채용 ('tab1') 상세페이지 이동 
    const onDetail = (board) => {
        axios.put(`http://localhost:8090/api/campus/board/${board.id}/count`) // 조회수 증가
            .then(() => {
                navigate(`/campus_board/CampusBoardDetail/${board.id}`); // 수정된 경로
            })
            .catch((error) => {
                console.error("조회수 증가 중 오류 발생:", error);
            });
    };

     // 교내 채용 ('tab2') 상세페이지 이동 
    const onDetail2 = (suggestBoard) => {
        axios.put(`http://localhost:8090/api/suggest/board/${suggestBoard.id}/count`)
            .then(() => {
                navigate(`/suggest_board/SuggestBoarddetail/${suggestBoard.id}`, { state: { ...suggestBoard } }); // 수정된 경로
            })
            .catch((error) => {
                console.error("조회수 증가 중 오류 발생:", error);
            });
    };

    const onDetail3 = (workBoard) => {
        const eventNo = workBoard.eventNo; // workBoard에서 eventNo 가져오기
        const areaCd = workBoard.areaCd;

        // 현재 검색 옵션을 sessionStorage에 저장
        sessionStorage.setItem("searchOptions", JSON.stringify(searchOption));

        console.log("🔍 eventNo:", eventNo, "areaCd:", areaCd);
        navigate(`/work_board/WorkBoardDetail/${eventNo}?areaCd=${areaCd}`); // URL 파라미터로 eventNo 전달
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
                                                <td onClick={() => onDetail2(job)}>{job.title}</td>
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
                                                <td onClick={() => onDetail3(job)}>{job.title}</td>
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
