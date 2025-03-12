import { Link } from "react-router-dom";
import React from 'react';
import Sidebar from './RecruitmentSidebar'; // Sidebar 컴포넌트 임포트
import "../MainPage/MainRecruitment.css"; // CSS 임포트
import InBoard from "../../recruitment/img/InBoard.webp"; // 이미지 임포트
import OutBoard from "../../recruitment/img/OutBoard.webp";
import Workboard from "../../recruitment/img/WorkBoard.webp";
import JobPosting from "../../recruitment/img/JobPosting.webp";

function MainRecruitment() {
    return (
        <div className="main-recruitment__container mt-5">
            <Sidebar className="main-recruitment__sidebar-fixed" /> {/* 사이드바 */}
            <div className="main-recruitment__col-md-9"> {/* 중앙 콘텐츠 */}
                <div className="main-recruitment__row">
                    {[
                        { to: "/SuggestBoard", imgSrc: OutBoard, title: "추천 채용공고" },
                        { to: "/CampusBoard", imgSrc: InBoard, title: "교내 채용공고" },
                        { to: "/WorkBoard", imgSrc: Workboard, title: "국내 채용행사" },
                        { to: "/JobPostingBoard", imgSrc: JobPosting, title: "외부 채용공고 사이트" },
                    ].map((card, index) => (
                        <div className="main-recruitment__col-md-4" key={index}>
                            <Link to={card.to} className="main-recruitment__card-link"> {/* className 추가 */}
                                <div className="main-recruitment__card">
                                    <img src={card.imgSrc} className="main-recruitment__card-img-top" alt={card.title} />
                                    <div className="main-recruitment__card-body">
                                        <h5 className="main-recruitment__card-title">{card.title}</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainRecruitment;
