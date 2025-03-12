import React, { useState } from "react"
import Map from "./Map"; // Map 컴포넌트 추가
import "./DepartmentIntro.css"

const DepartmentIntro = () => {
  const [activeTab, setActiveTab] = useState("intro")

  const renderTabContent = () => {
    switch (activeTab) {
      case "intro":
        return (
          <div className="intro-content">
            <table className="intro-table">
              <tbody>
                <tr>
                  <td colSpan="2">
                    <h4>부서소개</h4>
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">팀명</td>
                  <td className="content-cell">일자리플러스센터</td>
                </tr>
                <tr>
                  <td className="label-cell">소개</td>
                  <td className="content-cell">
                    일자리플러스센터는 학생들의 취업과 진로를 지원하는 핵심 부서입니다. 우리는 다양한 프로그램과
                    서비스를 통해 학생들이 성공적인 직업 경로를 찾을 수 있도록 돕고 있습니다.
                  </td>
                </tr>
                <tr>
                  <td className="label-cell">업무</td>
                  <td className="content-cell">
                    <li>진로 및 취업지원 프로그램 기획 및 운영</li>
                    <ul>
                      <li>취업정보의 수집 및 제공</li>
                      <li>진로 및 취업 상담</li>
                      <li>멘토링 및 취업 프로그램 운영</li>
                      <li>취업특강 개최</li>
                      <li>학생경력개발시스템 운영</li>
                      <li>취·창업교양과목 개설 및 운영</li>
                      <li>전문자격시험준비반 학생 선발 및 지원</li>
                    </ul>
                    <li>창업지원 프로그램 기획 운영</li>
                    <ul>
                      <li>창업동아리 선발 및 지원</li>
                      <li>창업관련 경진대회 및 특강 개최</li>
                      <li>창업현장실습 및 대외협력 지원 등</li>
                    </ul>
                    <li>현장실습 기획 및 운영</li>
                    <ul>
                      <li>현장실습 업체 발굴</li>
                      <li>현장실습 학생 선발 및 지원</li>
                      <li>현장실습 솔루션 운영</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
        case "duties":
          return (
            <div className="duties-content">
              <h4>부서 담당 업무</h4>
              <table className="duties-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>직책</th>
                    <th>담당업무</th>
                    <th>전화번호</th>
                    <th>이메일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>홍길동</td>
                    <td>센터장</td>
                    <td>센터 총괄</td>
                    <td>02-123-0001</td>
                    <td>hong@example.com</td>
                  </tr>
                  <tr>
                    <td>김철수</td>
                    <td>부센터장</td>
                    <td>센터 운영 관리</td>
                    <td>02-123-0002</td>
                    <td>kim@example.com</td>
                  </tr>
                  <tr>
                    <td>이영희</td>
                    <td>팀장</td>
                    <td>취업 프로그램 기획</td>
                    <td>02-123-0003</td>
                    <td>lee@example.com</td>
                  </tr>
                  <tr>
                    <td>박지민</td>
                    <td>차장</td>
                    <td>기업 연계 및 관리</td>
                    <td>02-123-0004</td>
                    <td>park@example.com</td>
                  </tr>
                  <tr>
                    <td>최수진</td>
                    <td>과장</td>
                    <td>학생 상담 및 지도</td>
                    <td>02-123-0005</td>
                    <td>choi@example.com</td>
                  </tr>
                  <tr>
                    <td>정민우</td>
                    <td>선임</td>
                    <td>취업 통계 분석</td>
                    <td>02-123-0006</td>
                    <td>jung@example.com</td>
                  </tr>
                  <tr>
                    <td>강다은</td>
                    <td>직원</td>
                    <td>행정 업무 지원</td>
                    <td>02-123-0007</td>
                    <td>kang@example.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
      case "location":
        return (
          <div className="location-content">
            <h4>오시는 길</h4>
            <div className="map-container">
              <Map />
            </div>
            <div className="contact-info">
              <div className="address">
                <strong>주소:</strong> 경기도 군포시 한세로 30 한세대학교 일자리플러스센터
              </div>
              <div className="phone">
                <strong>전화:</strong> 031-450-5114
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="department-intro">
      <h1>부서소개</h1>
      <div className="tab-bar">
        <button className={`tab-button ${activeTab === "intro" ? "active" : ""}`} onClick={() => setActiveTab("intro")}>
          부서소개
        </button>
        <button
          className={`tab-button ${activeTab === "duties" ? "active" : ""}`}
          onClick={() => setActiveTab("duties")}
        >
          담당업무
        </button>
        <button
          className={`tab-button ${activeTab === "location" ? "active" : ""}`}
          onClick={() => setActiveTab("location")}
        >
          오시는 길
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  )
}

export default DepartmentIntro

