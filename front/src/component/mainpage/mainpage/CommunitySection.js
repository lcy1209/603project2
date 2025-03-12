import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CommunitySection.css";

const CommunitySection = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchLatestNotices = async () => {
      try {
        const response = await fetch("http://localhost:8090/api/programs");
        if (!response.ok) {
          throw new Error("Failed to fetch notices");
        }
        const data = await response.json();
        setNotices(data.content.slice(0, 3)); // 최신 3개만 가져오기
      } catch (error) {
        console.error("Error fetching latest notices:", error);
      }
    };

    fetchLatestNotices();
  }, []);

  return (
    <div className="community-section">
      <div className="notice-board">
        <h2 className="section-title">공지사항</h2>
        <ul className="notice-list">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <li key={notice.id} className="notice-item">
                <Link to={`/community/notice/detail/${notice.id}`} className="notice-link">
                  {notice.title}
                </Link>
                <span className="notice-date">{notice.createdDate.split("T")[0]}</span>
              </li>
            ))
          ) : (
            <li className="notice-item">공지사항이 없습니다.</li>
          )}
        </ul>
        <Link to="/community/notice" className="more-link">
          더 보기
        </Link>
      </div>
      <div className="community-board">
        <h2 className="section-title">커뮤니티</h2>
        <div className="community-links">
          <Link to="/community/faq" className="community-link">
            <h3 className="community-link-title">자주 묻는 질문 (FAQ)</h3>
            <p className="community-link-description">취업 관련 자주 묻는 질문들을 확인하세요.</p>
          </Link>
          <Link to="/counsel" className="community-link">
            <h3 className="community-link-title">Q&A</h3>
            <p className="community-link-description">취업 관련 질문을 남기고 답변을 받아보세요.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CommunitySection