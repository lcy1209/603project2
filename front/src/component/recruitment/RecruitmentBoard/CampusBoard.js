import axios from 'axios';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import RecruitmentSidebar from '../MainPage/RecruitmentSidebar'; // 사이드바 임포트
import "../RecruitmentBoard/CampusBoard.css"; // 수정된 경로
import Graystar from "../img/Graystar.png"; // 비즐겨찾기 이미지
import Goldstar from "../img/Goldstar.png"; // 즐겨찾기 이미지
import Download from "../img/Download.png"; // 첨부 아이콘 이미지
import { LoginContext } from "../../login/security/contexts/LoginContextProvider";

function CampusBoard() {
    const navigate = useNavigate();
    const [searchResult, setSearchResult] = useState([]);
    const [searchOption, setSearchOption] = useState({
        searchBy: "title",
        searchQuery: "",
    });

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBoardCount, setTotalBoardCount] = useState(0);
    const boardsPerPage = 8;

    // 게시글 목록 불러오기
    const fetchBoards = useCallback((page) => {
        axios.get('http://localhost:8090/api/campus/board/search', {
            params: {
                searchBy: searchOption.searchBy,
                searchQuery: searchOption.searchQuery,
                page: page - 1,
                size: boardsPerPage,
            },
        })
            .then((response) => {
                setSearchResult(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalBoardCount(response.data.totalElements);
            })
            .catch((error) => {
                console.error("게시글을 불러오는 중 오류 발생:", error);
            });
    }, [searchOption, boardsPerPage]);

    useEffect(() => {
        fetchBoards(currentPage);
    }, [currentPage, fetchBoards]);

    // 게시글 상세 페이지 이동
    const onDetail = (board) => {
        axios.put(`http://localhost:8090/api/campus/board/${board.id}/count`) // 조회수 증가
            .then(() => {
                navigate(`/campus_board/CampusBoardDetail/${board.id}`); // 수정된 경로
            })
            .catch((error) => {
                console.error("조회수 증가 중 오류 발생:", error);
            });
    };

    // 게시글 작성 페이지 이동
    const onCreateBoard = () => {
        navigate('/campus_board/CampusWrite'); // 수정된 경로
    };

    // 검색 옵션 변경
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setSearchOption((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // ✅ 즐겨찾기 상태 관리
    const [cpFavorites, setCpFavorites] = useState({});

    // 📌 로그인된 사용자의 즐겨찾기 목록 불러오기
    const fetchCpFavorites = useCallback(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        axios.get("http://localhost:8090/api/cp-favorites/my-favorites", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const favoriteIds = response.data.map(board => board.id);
                const favoriteMap = favoriteIds.reduce((acc, id) => {
                    acc[id] = true;  // 즐겨찾기한 게시글 ID를 true로 설정
                    return acc;
                }, {});
                setCpFavorites(favoriteMap);
            })
            .catch((error) => {
                console.error("교내 채용 즐겨찾기 목록을 불러오는 중 오류 발생:", error);
            });
    }, []);

    // 📌 즐겨찾기 추가/삭제 API 호출
    const { isLogin } = useContext(LoginContext);

    const toggleCpFavorite = (boardId) => {
        if (!isLogin) {
            alert("로그인이 필요합니다!");
            return;
        }

        const isFavorite = cpFavorites[boardId];
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("로그인이 필요합니다!");
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        if (isFavorite) {
            // ✅ 취소 확인 추가
            const confirmRemove = window.confirm("이 게시글을 즐겨찾기에서 삭제하시겠습니까?");
            if (!confirmRemove) return;
    
            axios.delete(`http://localhost:8090/api/cp-favorites/${boardId}`, { headers })
                .then(() => {
                    setCpFavorites(prevFavorites => ({ ...prevFavorites, [boardId]: false }));
                    alert("즐겨찾기에서 삭제되었습니다!");
                })
                .catch((error) => {
                    console.error("즐겨찾기 삭제 중 오류 발생:", error);
                });
        } else {
            axios.post(`http://localhost:8090/api/cp-favorites/${boardId}`, {}, { headers })
                .then(() => {
                    setCpFavorites(prevFavorites => ({ ...prevFavorites, [boardId]: true }));
                    alert("즐겨찾기에 추가되었습니다!");
                })
                .catch((error) => {
                    console.error("즐겨찾기 추가 중 오류 발생:", error);
                });
        }
    };

    // 📌 초기 마운트 시 즐겨찾기 목록 불러오기
    useEffect(() => {
        fetchCpFavorites();
    }, [fetchCpFavorites]);

    const handleAttachmentClick = (boardId) => {
        const isConfirmed = window.confirm("다운로드 하시겠습니까?");
        if (isConfirmed) {
            alert(`보드 ${boardId}의 첨부 파일이 다운로드 됩니다.`);
        }
    };


    return (
        <div className="board-with-sidebar">
            <RecruitmentSidebar /> {/* 사이드바 추가 */}
            <div className="board-content-area">
                <section className="board-list">
                    <div id="search">
                        <div className="b-container">
                            <div className="bpage-title">
                                <h3>교내 채용공고 게시판</h3>
                            </div>
                            <div className="bsearch-wrap">
                                <select name="searchBy" value={searchOption.searchBy} onChange={handleOnChange}>
                                    <option value="writerName">작성자</option>
                                    <option value="title">제목</option>
                                </select>
                                <input type="text" name="searchQuery" value={searchOption.searchQuery} onChange={handleOnChange} />
                                <button className="btn btn-dark" onClick={() => fetchBoards(1)}>검색</button>
                                <button className="btn btn-primary write-btn" onClick={onCreateBoard}>작성하기</button>
                            </div>
                            <div className="b-count_content">
                                총 {totalBoardCount}건 / {totalPages} 페이지
                            </div>
                        </div>
                    </div>
                    <div className="b-list">
                        <table className="campus-table">
                            <thead>
                                <tr>
                                    <th>즐겨찾기</th>
                                    <th className="th-num">번호</th>
                                    <th>제목</th>
                                    <th className="th-writer">작성자</th>
                                    <th className="th-date">작성일</th>
                                    <th className="th-num">조회수</th>
                                    <th>첨부</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResult.map((campusBoard, index) => (
                                    <tr key={campusBoard.id}>
                                        {/* ✅ 교내 채용 즐겨찾기 (CpFavoriteBoard) */}
                                        <td className="campus-centered-icon" onClick={() => toggleCpFavorite(campusBoard.id)}>
                                            <img
                                                src={cpFavorites[campusBoard.id] ? Goldstar : Graystar}
                                                alt="즐겨찾기"
                                                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                                            />
                                        </td>

                                        <td className="th-num">{index + 1 + (currentPage - 1) * boardsPerPage}</td>
                                        <td className="th-title" onClick={() => onDetail(campusBoard)}>{campusBoard.title}</td>
                                        <td className="th-writer">{campusBoard.writerName}</td>

                                        <td className="th-date">
                                            {campusBoard.regTime
                                                ? new Date(campusBoard.regTime).toISOString().split('T')[0]
                                                : '값이 없음'}
                                        </td>

                                        <td className="th-num">{campusBoard.count}</td>

                                        <td className="campus-centered-icon" onClick={() => handleAttachmentClick(campusBoard.id)}>
                                            <img src={Download} alt="첨부" style={{ width: "20px", height: "20px" }} />
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </section>
            </div>
        </div>
    );
};

export default CampusBoard;