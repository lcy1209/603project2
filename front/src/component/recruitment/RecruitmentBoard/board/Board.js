import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import RecruitmentSidebar from '../../MainPage/RecruitmentSidebar'; // 사이드바 임포트
import "./Board.css";

function Board() {
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
        axios.get('http://localhost:8090/api/board/search', {
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
        axios.put(`http://localhost:8090/api/board/${board.id}/count`)
            .then(() => {
                navigate(`/board/detail/${board.id}`, { state: { ...board } });
            })
            .catch((error) => {
                console.error("조회수 증가 중 오류 발생:", error);
            });
    };

    // 게시글 작성 페이지 이동
    const onCreateBoard = () => {
        navigate('/board/write');
    };

    // 검색 옵션 변경
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setSearchOption((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="board-with-sidebar">
            <RecruitmentSidebar /> {/* 사이드바 추가 */}
            <div className="board-content-area">
                <section className="board-list">
                    <div id="search">
                        <div className="b-container">
                            <div className="bpage-title">
                                <h3>게시판</h3>
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
                        <table className="b-table">
                            <thead>
                                <tr>
                                    <th className="th-num">번호</th>
                                    <th className="th-title">제목</th>
                                    <th className="th-writer">작성자</th>
                                    <th className="th-date">작성일</th>
                                    <th className="th-num">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResult.map((board) => (
                                    <tr key={board.id}>
                                        <td className="th-num">{board.id}</td>
                                        <td className="th-title" onClick={() => onDetail(board)}>{board.title}</td>
                                        <td className="th-writer">{board.writerName}</td>
                                        <td className="th-date">
                                            {board.regTime 
                                                ? new Date(board.regTime).toISOString().split('T')[0] // YYYY-MM-DD 형식으로 변환
                                                : '값이 없음'}
                                        </td>
                                        <td className="th-num">{board.count}</td>
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

export default Board;
