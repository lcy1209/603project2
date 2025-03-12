import React from 'react';
import "../RecruitmentBoard/JobPostingBoard.css";
import Sidebar from '../MainPage/RecruitmentSidebar'; // Sidebar 컴포넌트 임포트
import Work24 from "../../recruitment/img/Work24.png"; // 이미지 임포트
import Jobkorea from "../../recruitment/img/Jobkorea.png";
import Tool24 from "../../recruitment/img/Tool24.png";
import Saram from "../../recruitment/img/Saram.png";
import Incruit from "../../recruitment/img/Incruit.png";
import Jobplanet from "../../recruitment/img/Jobplanet.png";

function JobPostingBoard() {
    return (
        <div className="jobpost-container mt-5">
            <Sidebar /> {/* 사이드바 */}
            <div className="jobpost-col-md-9"> {/* 중앙 콘텐츠 */}
                {/* 안내 메시지 카드 */}
                {/* <div className="jobpost-message-card text-center mb-4">
                    <h1>이미지 클릭 시 해당 게시판으로 이동합니다.</h1>
                </div> */}

                {/* 카드 박스 부분 */}
                <div className="jobpost-row">
    {[
        { href: "https://www.work24.go.kr/cm/main.do", imgSrc: Work24, title: "고용24 바로가기" },
        { href: "https://www.jobkorea.co.kr/", imgSrc: Jobkorea, title: "잡코리아 바로가기" },
        { href: "https://www.saramin.co.kr/zf_user/", imgSrc: Saram, title: "사람인 바로가기" },
        { href: "https://www.incruit.com/", imgSrc: Incruit, title: "인크루트 바로가기" },
        { href: "https://www.saramin.co.kr/zf_user/tools/character-counter", imgSrc: Tool24, title: "취업TooL" },
        { href: "https://www.jobplanet.co.kr/welcome/index", imgSrc: Jobplanet, title: "잡 플래닛 바로가기" },
    ].map((card, index) => (
        <div className="jobpost-col-md-4" key={index}>
            <a href={card.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}> {/* 링크의 밑줄 제거 */}
                <div className="jobpost-card">
                    <div className="card-img-wrapper"> {/* 이미지 래퍼 추가 */}
                        <img src={card.imgSrc} className="jobpost-card-img-top" alt={card.title} />
                    </div>
                    <div className="jobpost-card-body">
                        <h5 className="jobpost-card-title">{card.title}</h5>
                    </div>
                </div>
            </a>
        </div>
    ))}
</div>

            </div>
        </div>
    );
}

export default JobPostingBoard;
