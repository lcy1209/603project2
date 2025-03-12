import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./WorkBoardDetail.css";

const WorkBoardDetail = () => {
    const { id } = useParams(); // URL 파라미터에서 id 가져오기
    const [eventDetail, setEventDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [error, setError] = useState(null);
    const areaCd = query.get("areaCd");
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                const response = await axios.get("http://localhost:8090/api/work/board/detail", {
                    params: { eventNo: id, areaCd: areaCd }, // API에 eventNo 전달
                });

                setEventDetail(response.data); // JSON 응답을 상태에 저장

            } catch (err) {
                console.error("❌ 데이터 불러오기 오류:", err);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetail();
    }, [id, areaCd]); // id가 변경될 때마다 호출

    if (loading) return <p>데이터 로딩 중...</p>;
    if (error) return <p>{error}</p>;
    
    if (!eventDetail) return <p>데이터가 없습니다.</p>;

    const handleBackToList = () => {
        navigate("/WorkBoard"); // 목록 페이지로 이동
    };

    return (
        <>
            <div className="workdetail-container mx-auto p-4">
                <h1 className="workdetail-title">{eventDetail.title}</h1>
                
                <div className="workdetail-section">
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">기간:</strong> {eventDetail.eventTerm}</p>
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">장소:</strong> {eventDetail.eventPlc}</p>
                </div>
                
                <div className="workdetail-section">
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">참여 기업:</strong></p>
                    <ul className="workdetail-list">
                        <li className="workdetail-list-item">{eventDetail.joinCoWantedInfo}</li>
                    </ul>
                </div>
            
                <div className="workdetail-section">
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">부대사항:</strong> {eventDetail.subMatter}</p>
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">문의 전화:</strong> {eventDetail.inqTelNo}</p>
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">팩스:</strong> {eventDetail.fax}</p>
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">담당자:</strong> {eventDetail.charger}</p>
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">이메일:</strong> {eventDetail.email}</p>
                    <p className="workdetail-paragraph"><strong className="workdetail-strong">오시는 길:</strong> {eventDetail.visitPath}</p>
                </div>
            </div>

            {/* 카드 박스 바깥에 버튼 추가 */}
            <div className="workdetail-button-container">
                <button className="workdetail-back-to-list-button" onClick={handleBackToList}>
                    목록으로
                </button>
            </div>
        </>
    );
};

export default WorkBoardDetail;
