import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../write/CampusWrite.css'; // CSS 파일도 수정하였다고 가정

function CampusWrite() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const [selectedFiles, setSelectedFiles] = useState([]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    // 게시글 등록
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // 제목과 내용 검사
      if (!formData.title || !formData.content) {
          alert('제목과 내용을 입력해주세요.');
          return;
      }
  
      const token = localStorage.getItem("accessToken");
      if (!token) {
          alert('로그인이 필요합니다.');
          return;
      }

      const data = new FormData();
        const boardJson = JSON.stringify(formData);
        const blob = new Blob([boardJson], { type: "application/json" });
    
        data.append('campusBoardFormDto', blob);
        selectedFiles.forEach(file => data.append('campusBoardImgFile', file));

      
  
      try {
          await axios.post('http://localhost:8090/api/campus/board/admin/new', data, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              }
          });
          alert('게시글이 등록되었습니다.');
          navigate('/CampusBoard');
      } catch (error) {
          console.error('게시글 등록 오류:', error);
          alert('게시글 등록 중 오류가 발생했습니다.');
      }
  };
  


    return (
        <div className="board-write-container">
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit} className="board-form">
                <label>제목</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                <label>내용</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required />

                <label>이미지 업로드</label>
                <input type="file" multiple onChange={handleFileChange} />

                <div className="board-btn-group">
                    <button type="submit" className="btn-submit">등록</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('/CampusBoard')}>취소</button> {/* 수정된 경로 */}
                </div>
            </form>
        </div>
    );
}

export default CampusWrite;
