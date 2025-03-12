import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./SuggestBoardDetail.css"; // CSS 파일명 변경

function SuggestBoardDetail() { // 클래스명 변경
    const { boardId } = useParams(); // URL에서 boardId 가져오기
    const navigate = useNavigate();
    const [suggestBoard, setSuggestBoard] = useState(null); // 변수명 변경
    const [loading, setLoading] = useState(true);

    // ✅ 게시글 상세 조회
    useEffect(() => {
        const fetchSuggestBoardDetail = async () => { // 함수명 변경
            try {
                const response = await axios.get(`http://localhost:8090/api/suggest/board/${boardId}`); // API 경로 변경
                console.log("📌 API 응답 데이터:", response.data); // ✅ API 응답 확인
                setSuggestBoard(response.data); // 변수명 변경
                setLoading(false);
            } catch (error) {
                console.error('게시글 불러오기 오류:', error);
                alert('게시글을 불러오는 중 오류가 발생했습니다.');
                navigate('/suggest/board'); // 수정된 경로
            }
        };
        fetchSuggestBoardDetail(); // 함수명 변경
    }, [boardId, navigate]);

    // 게시글 삭제 핸들러
    const handleDelete = async () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            const token = localStorage.getItem("accessToken"); // JWT 토큰 가져오기

            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                await axios.delete(`http://localhost:8090/api/suggest/board/admin/delete`, { // API 경로 변경
                    data: { id: boardId }, // 삭제할 게시글 ID
                    headers: {
                        Authorization: `Bearer ${token}` // JWT 토큰 추가
                    }
                });
                alert("게시글이 삭제되었습니다.");
                navigate('/suggestboard'); // 삭제 후 목록으로 이동 (수정된 경로)
            } catch (error) {
                console.error('게시글 삭제 오류:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    // 게시글 수정 핸들러
    const handleEdit = () => {
        navigate(`/suggest_board/SuggestBoardEdit/${boardId}`); // 수정 페이지로 이동 (수정된 경로)
    };

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="board-detail-container">
            <h2 className="board-title">{suggestBoard.title}</h2> {/* 변수명 변경 */}
            <div className="board-info">
                <span className="board-writer">작성자: {suggestBoard.writerName}</span> {/* 변수명 변경 */}
                <span className="board-date">작성일: {suggestBoard.updateTime?.split('T')[0]}</span> {/* 변수명 변경 */}
                <span className="board-count">조회수: {suggestBoard.count}</span> {/* 변수명 변경 */}
            </div>
            <div className="board-content">{suggestBoard.content}</div> {/* 변수명 변경 */}

            {/* 첨부 이미지 표시 */}
{suggestBoard.suggestBoardImgs && suggestBoard.suggestBoardImgs.length > 0 ? (
    <div className="board-images-container">
        {suggestBoard.suggestBoardImgs.map((img) => {
            const imageUrl = img.imgUrl.startsWith("http") ? img.imgUrl : `http://localhost:8090${img.imgUrl}`;
            return (
                <img key={img.id} src={imageUrl} alt="첨부 이미지" className="board-img" />
            );
        })}
    </div>
) : (
    <p className="no-image">첨부된 이미지가 없습니다.</p>
)}


            <div className="board-buttons">
                <button className="btn-back" onClick={() => navigate('/suggestboard')}>목록으로</button> {/* 수정된 경로 */}
                <button className="btn-edit" onClick={handleEdit}>수정하기</button> {/* 수정하기 클릭 시 경로 수정 */}
                <button className="btn-delete" onClick={handleDelete}>삭제하기</button>
               
            </div>
        </div>
    );
}

export default SuggestBoardDetail; // 클래스명 변경
