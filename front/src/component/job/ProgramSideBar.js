import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faBriefcase,
  faLightbulb,
  faUserGraduate,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import "./styles/ProgramSideBar.css"; 

function ProgramSideBar() {
  return (
    <div className="program-sidebar-container">
      <nav className="program-sidebar">
        <h2 className="program-sidebar-title">프로그램</h2>
        <ul>
          <li>
            <NavLink to="/programs" end>
              <FontAwesomeIcon icon={faList} className="icon" /> 전체
            </NavLink>
          </li>
          <li>
            <NavLink to="/programs/job">
              <FontAwesomeIcon icon={faBriefcase} className="icon" /> 취업
            </NavLink>
          </li>
          <li>
            <NavLink to="/programs/startup">
              <FontAwesomeIcon icon={faLightbulb} className="icon" /> 창업
            </NavLink>
          </li>
          <li>
            <NavLink to="/programs/career">
              <FontAwesomeIcon icon={faUserGraduate} className="icon" /> 진로
            </NavLink>
          </li>
          <li>
            <NavLink to="/programs/applicationslist">
              <FontAwesomeIcon icon={faClipboardList} className="icon" /> 신청 내역
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProgramSideBar;