import React from "react"
import { Link } from "react-router-dom"
import "./InfoBoxes.css"

const InfoBoxes = () => {
  const boxes = [
    { title: "취업통계", link: "/statistics" },
    { title: "취업후기", link: "/reviews" },
    { title: "추천채용", link: "/featured-jobs" },
    { title: "이력서/자소서", link: "/resume-guide" },
    { title: "멘토링", link: "/mentoring" },
  ]

  return (
    <div className="info-boxes">
      {boxes.map((box, index) => (
        <Link key={index} to={box.link} className="info-box">
          <h3 className="info-box-title">{box.title}</h3>
          <p className="info-box-text">자세히 보기</p>
        </Link>
      ))}
    </div>
  )
}

export default InfoBoxes