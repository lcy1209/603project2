import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./CampusBoardEdit.css";

function CampusBoardEdit() {
    const { boardId } = useParams(); // URL에서 boardId 가져오기
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // 게시글 상세 조회
    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/campus/board/${boardId}`);
                setFormData({
                    title: response.data.title,
                    content: response.data.content,
                });
                setLoading(false);
            } catch (error) {
                console.error('게시글 불러오기 오류:', error);
                alert('게시글을 불러오는 중 오류가 발생했습니다.');
                navigate('/campus/board');
            }
        };
        fetchBoardDetail();
    }, [boardId, navigate]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    // 게시글 수정 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken"); // JWT 토큰 가져오기
    
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }
    
        const data = new FormData();
        
        // Blob을 사용하여 campusBoardFormDto를 추가
        data.append('campusBoardFormDto', new Blob([JSON.stringify({
            id: boardId,
            title: formData.title,
            content: formData.content
        })], { type: 'application/json' }));
    
        const idList = [/* 필요한 ID 리스트 */];
        data.append('idList', JSON.stringify(idList)); // ID 리스트 추가
    
        selectedFiles.forEach(file => data.append('campusImgFile', file)); // 파일 추가
    
        try {
            await axios.put(`http://localhost:8090/api/campus/board/admin/update`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("게시글이 수정되었습니다.");
            navigate('/CampusBoard'); // 수정 후 목록 페이지로 이동
        } catch (error) {
            console.error('게시글 수정 오류:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div className="campusboardedit-loading">로딩 중...</div>;

    return (
        <div className="campusboardedit-container"> {/* 컨테이너 추가 */}
            <div className="campusboardedit-board-edit-container">
                <h2>게시글 수정</h2>
                <form onSubmit={handleSubmit} className="campusboardedit-board-form">
                    <label>제목</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>내용</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />

                    <label>이미지 업로드</label>
                    <input type="file" multiple onChange={handleFileChange} />

                    {/* 버튼 그룹 추가 */}
                    <div className="campusboardedit-board-btn-group">
                        <button type="submit" className="campusboardedit-btn-submit">수정하기</button>
                        <button type="button" className="campusboardedit-btn-cancel" onClick={() => navigate('/CampusBoard')}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CampusBoardEdit;
