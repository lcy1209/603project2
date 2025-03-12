import React from "react"
import { Link } from "react-router-dom"
import { ArrowUp } from "lucide-react"
import "./Footer.css"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="https://www.hansei.ac.kr/kor/239/subview.do" className="footer-link">
              개인정보처리방침
            </Link>
            <Link to="https://www.hansei.ac.kr/kor/240/subview.do" className="footer-link">
              CCTV설치운영지침
            </Link>
            <Link to="https://www.hansei.ac.kr/kor/784/subview.do" className="footer-link">
              이메일주소 무단수집거부
            </Link>
          </div>
          <div className="footer-info">
            <img src="/images/logos/logo_gray.png" alt="한세대학교 로고" className="footer-logo" />
            <div className="footer-text">
              <p>[15852] 경기도 군포시 한세로 30 한세대학교 TEL : 031-450-5114</p>
              <p>COPYRIGHT 2018 HANSEI UNIVERSITY ALL RIGHT RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
      <button onClick={scrollToTop} className="scroll-to-top" aria-label="페이지 상단으로 이동">
        <ArrowUp size={24} />
      </button>
    </footer>
  )
}

export default Footer