import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation(); // 현재 URL 가져오기

    return (
        <div className="mysidebar">
            <h3>마이페이지</h3>
            <div className="mysidebar-division-line"></div>
            <ul>
                <li>
                    <NavLink to="/myEdit" className={location.pathname.startsWith("/myEdit") ? "active" : ""}>
                        회원정보
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mySecession" className={location.pathname.startsWith("/mySecession") ? "active" : ""}>
                        회원탈퇴
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/myEmployment" className={location.pathname.startsWith("/myEmployment") ? "active" : ""}>
                        나의 채용 정보
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/myProgram" className={location.pathname.startsWith("/myProgram") ? "active" : ""}>
                        나의 취업 프로그램
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/myCounsel" className={location.pathname.startsWith("/myCounsel") ? "active" : ""}>
                        나의 온라인 상담
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
