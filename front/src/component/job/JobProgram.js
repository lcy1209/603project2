import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProgramSideBar from "./ProgramSideBar"; // ✅ 사이드바 추가
import ProgramView from "./ProgramView"; // ✅ 기존 프로그램 리스트 렌더링
import "./styles/JobProgram.css";

function JobProgram() {
  const location = useLocation();
  const [category, setCategory] = useState("전체");

  // ✅ URL을 기반으로 카테고리 동적으로 설정
  useEffect(() => {
    if (location.pathname.includes("/programs/job")) {
      setCategory("취업");
    } else if (location.pathname.includes("/programs/startup")) {
      setCategory("창업");
    } else if (location.pathname.includes("/programs/career")) {
      setCategory("진로");
    } else {
      setCategory("전체");
    }
  }, [location.pathname]);

  return (
    <div className="job-main-layout">
      <ProgramSideBar /> {/* ✅ 사이드바 추가 */}
      <div className="job-main-content">
        <div className="container mt-4">
          <div className="program-wrapper">
            <div className="program-header">
              <h2 className="program-title">{category} 프로그램</h2>
              <hr className="program-divider" />
            </div>
            {/* ✅ ProgramView에 category 전달하여 연동 */}
            <ProgramView category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobProgram;