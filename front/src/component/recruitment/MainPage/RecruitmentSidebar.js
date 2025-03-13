// Sidebar.js
import { Link } from "react-router-dom";
import React from 'react';

import "../MainPage/RecruitmentSidebar.css";


function RecruitmentSidebar() {
    return (
        <div className="recruitment-sidebar-fixed">
            <div className="recruitment-sidebar">
                <h4>빠른 이동</h4>
                <ul className="list-unstyled">
                    <li><Link to="/MainRecruitment">메인화면 돌아가기</Link></li>
                    <li><Link to="/SuggestBoard">추천 채용공고</Link></li>
                    <li><Link to="/CampusBoard">교내 채용공고</Link></li>
                    <li><Link to="/WorkBoard">국내 채용행사</Link></li>                 
                    <li><Link to="/JobPostingBoard">외부 채용공고 사이트</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default RecruitmentSidebar;
