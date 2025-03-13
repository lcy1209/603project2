import { Briefcase, GraduationCap, Users, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import "./IconMenu.css"

const IconMenu = () => {
  const menuItems = [
    {
      icon: <Briefcase size={40} />,
      text: "채용정보",
      link: "/jobs",
      className: "jobs",
    },
    {
      icon: <GraduationCap size={40} />,
      text: "교육프로그램",
      link: "/programs",
      className: "programs",
    },
    {
      icon: <Users size={40} />,
      text: "상담예약",
      link: "/counseling",
      className: "counseling",
    },
    {
      icon: <FileText size={40} />,
      text: "자료실",
      link: "/resources",
      className: "resources",
    },
  ]

  return (
    <div className="icon-menu">
      {menuItems.map((item, index) => (
        <Link key={index} to={item.link} className={`icon-menu-item ${item.className}`}>
          <div className="icon-menu-icon">{item.icon}</div>
          <span className="icon-menu-text">{item.text}</span>
        </Link>
      ))}
    </div>
  )
}

export default IconMenu