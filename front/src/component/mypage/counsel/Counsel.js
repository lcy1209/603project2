import React, { useEffect, useState, useMemo, useContext } from 'react';
import './Counsel.css';
import Sidebar from '../page/Sidebar';
import { Search as SearchIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import axios from 'axios';
import { LoginContext } from '../../login/security/contexts/LoginContextProvider';
import useIsAdmin from "../../board/hooks/useIsAdmin";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Counsel = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [removingItems, setRemovingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [sortOption, setSortOption] = useState("latest"); // 최신순 / 오래된순 선택
    const [onlineCounsel, setOnlineCounsel] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const { isName } = useContext(LoginContext);
    const isAdmin = useIsAdmin();

    // 백엔드에서 상담 내역 가져오기
    useEffect(() => {
        const fetchCounsels = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `/api/counsel?page=${currentPage - 1}&size=${ITEMS_PER_PAGE}&sort=${sortOption}&keyword=${searchQuery}`
                );
                setOnlineCounsel(response.data.content); // 백엔드에서 받은 데이터 설정
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            }
            setLoading(false);
        };

        fetchCounsels();
    }, [currentPage, searchQuery, sortOption]);

    // 최신순 / 오래된순 정렬
    const sortedOnlineCounsel = useMemo(() => {
        return [...onlineCounsel].sort((a, b) =>
            sortOption === "latest"
                ? new Date(b.createdDate) - new Date(a.createdDate)
                : new Date(a.createdDate) - new Date(b.createdDate)
        );
    }, [onlineCounsel, sortOption]);

    // 검색 필터 적용
    const currentData = useMemo(() => {
        if (!searchQuery.trim()) return sortedOnlineCounsel;
        return sortedOnlineCounsel.filter(
            (item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.createdDate.includes(searchQuery)
        );
    }, [sortedOnlineCounsel, searchQuery]);

    // 페이지네이션 적용 
    const totalPages = useMemo(() => {
        return currentData.length > 0 ? Math.ceil(currentData.length / ITEMS_PER_PAGE) : 1;
    }, [currentData]);

    // 검색어나 필터 변경 시 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortOption]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return currentData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentData, currentPage]);

    // 검색어 입력 핸들러
    const handleSearch = (e) => { setSearchQuery(e.target.value); };

    // 체크박스 토글 
    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 선택 삭제 (백엔드 연동)
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        if (!window.confirm("선택한 항목을 삭제하시겠습니까?")) return;

        try {
            await Promise.all(selectedItems.map((id) => axios.delete(`/api/counsel/${id}`)));
            setOnlineCounsel((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
            setSelectedItems([]);
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    // 전체 선택 
    const handleSelectAll = () => {
        const allIds = currentData.map(item => item.id);
        if (selectedItems.length === allIds.length) {
            setSelectedItems([]); // 전체 해제
        } else {
            setSelectedItems(allIds); // 전체 선택
        }
    };

    // 탭 값 사라지면 탭 없애기 
    const showTabs = useMemo(() => {
        return onlineCounsel.length > 0;
    }, [onlineCounsel]);

    // 상담 상세페이지 이동
    const handlePostClick = (post) => {
        // 관리자이거나 작성자인 경우에만 접근 가능
        if (isAdmin || post.author === isName) {
            navigate(`/counsel/online/detail/${post.id}`);
        } else {
            alert('작성자만 열람할 수 있습니다.');
        }
    };

    return (
        <div>
            <div className="mycounsel-container">
                <main className="mycounsel-main">
                    <Sidebar />
                    <section className="mycounsel-form-container">
                        <h2>나의 온라인 상담</h2>
                        <div className="mycounsel-division-line"></div>

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
                            <SearchIcon className="search-icon" />
                        </div >

                        {/* 검색 결과가 없을 때 메시지 표시 */}
                        {searchQuery.trim() && paginatedData.length === 0 ? (
                            <div className="no-data-message">
                                <AlertCircle className="no-data-icon" />
                                검색한 결과가 없습니다.
                            </div>
                        ) : !showTabs ? (
                            <div className="no-data-message">
                                <AlertCircle className="no-data-icon" />
                                최근 나의 상담이 없습니다
                            </div>
                        ) : (
                            <>
                                {paginatedData.length > 0 && (
                                    <table className="mycounsel-table">
                                        <thead>
                                            <tr>
                                                {/* 검색 중이 아닐 때만 "즐겨찾기" 컬럼 표시 */}
                                                {!searchQuery.trim() && (
                                                    <th onClick={handleSelectAll} style={{ cursor: "pointer", textAlign: "center" }}>
                                                        {selectedItems.length > 0 && selectedItems.length === currentData.length ? "✔️" : "✔️"}
                                                    </th>
                                                )}
                                                <th>번호</th>
                                                <th>작성 날짜</th>
                                                <th>제목</th>
                                                <th>문의 상태</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {/* {paginatedData. */}
                                            {currentData.slice((currentPage - 1) * ITEMS_PER_PAGE,
                                                currentPage * ITEMS_PER_PAGE).map((item) => (
                                                    <tr key={item.id}
                                                        className={removingItems.includes(item.id) ? "fade-out-right" : ""}
                                                        style={{
                                                            cursor: "pointer",
                                                            textAlign: "center",
                                                            backgroundColor: selectedItems.includes(item.id) ? "" : "transparent"
                                                        }}
                                                        onClick={() => toggleSelectItem(item.id)} //  행을 클릭하면 체크박스도 선택
                                                    >

                                                        {/* 검색 중이 아닐 때만 체크박스 표시 */}
                                                        {!searchQuery.trim() && (
                                                        <td className="mycounsel-checkbox-container"
                                                            onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                id={`checkbox-${item.id}`}
                                                                checked={selectedItems.includes(item.id)}
                                                                 onChange={() => toggleSelectItem(item.id)}
                                                            />
                                                            <label htmlFor={`checkbox-${item.id}`} className="mycounsel-checkbox-label"></label>
                                                        </td>
                                                        )}
                                                        <td>{item.id}</td>
                                                        <td>{new Date(item.createdDate).toLocaleDateString()}</td>
                                                        <td><span className='common-board-title'
                                                            onClick={() => handlePostClick(item)}>
                                                            {item.title}
                                                        </span>
                                                        </td>
                                                        <td className={item.answer ? "answer-text" : ""}>
                                                            {item.answer ? "답변 완료" : "미완료"}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* 삭제 버튼 */}
                                {showTabs && !searchQuery.trim() && (
                                    <div className="mycounsel-tabs-container">

                                        {/* 검색 중이 아닐 때만 삭제 버튼 표시 */}
                                        {!searchQuery.trim() && selectedItems.length > 0 && removingItems.length === 0 && (
                                            <div className="mycounsel-delete-controls">
                                                <button className="mycounsel-delete-btn" onClick={handleDeleteSelected}>삭제</button>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* 검색 결과가 없을 때 페이지네이션 숨김 */}
                                {paginatedData.length > 0 && totalPages > 1 && (
                                    <div className="mycounsel-pagination">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`mycounsel-pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                    </section>
                </main>
            </div>
        </div>
    );
};

export default Counsel;
