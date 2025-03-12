import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./CampusBoardDetail.css";

function CampusBoardDetail() {
    const { boardId } = useParams(); // URL에서 boardId 가져오기
    const navigate = useNavigate();
    const [campusBoard, setCampusBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ 캠퍼스 게시글 상세 조회
    useEffect(() => {
        const fetchCampusBoardDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/campus/board/${boardId}`);
                console.log("📌 API 응답 데이터:", response.data); // ✅ API 응답 확인
                setCampusBoard(response.data);
                setLoading(false);
            } catch (error) {
                console.error('캠퍼스 게시글 불러오기 오류:', error);
                alert('캠퍼스 게시글을 불러오는 중 오류가 발생했습니다.');
                navigate('/campus/board');
            }
        };
        fetchCampusBoardDetail();
    }, [boardId, navigate]);

    // 캠퍼스 게시글 삭제 핸들러
    const handleDelete = async () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            const token = localStorage.getItem("accessToken"); // JWT 토큰 가져오기

            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                await axios.delete(`http://localhost:8090/api/campus/board/admin/delete`, {
                    data: { id: boardId }, // 삭제할 캠퍼스 게시글 ID
                    headers: {
                        Authorization: `Bearer ${token}` // JWT 토큰 추가
                    }
                });
                alert("캠퍼스 게시글이 삭제되었습니다.");
                navigate('/CampusBoard'); // 삭제 후 목록으로 이동
            } catch (error) {
                console.error('캠퍼스 게시글 삭제 오류:', error);
                alert('캠퍼스 게시글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    // 캠퍼스 게시글 수정 핸들러
    const handleEdit = () => {
        navigate(`/campus_board/CampusBoardEdit/${boardId}`); // 수정 페이지로 이동
    };

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="board-detail-container">
            <h2 className="board-title">{campusBoard.title}</h2>
            <div className="board-info">
                <span className="board-writer">작성자: {campusBoard.writerName}</span>
                <span className="board-date">작성일: {campusBoard.updateTime?.split('T')[0]}</span>
                <span className="board-count">조회수: {campusBoard.count}</span>
            </div>
            <div className="board-content">{campusBoard.content}</div>

            {/* 첨부 이미지 표시 */}
{campusBoard.campusBoardImgs && campusBoard.campusBoardImgs.length > 0 ? (
    <div className="board-images-container">
        {campusBoard.campusBoardImgs.map((img) => {
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
                <button className="btn-back" onClick={() => navigate('/CampusBoard')}>목록으로</button> {/* 수정된 경로 */}
                <button className="btn-edit" onClick={handleEdit}>수정하기</button> {/* 수정하기 클릭 시 CampusBoardEdit로 이동 */}
                <button className="btn-delete" onClick={handleDelete}>삭제하기</button>
                
            </div>
        </div>
    );
}

export default CampusBoardDetail;
