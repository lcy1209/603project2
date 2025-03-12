import { Link, useLocation } from "react-router-dom"
import { getSubmenuByTitle } from "../../utils/menuItems"
import "./AboutSidebar.css"

const AboutSidebar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const menuItems = getSubmenuByTitle("센터소개")

  {/*
  const menuItems = [
    { path: "/about/department-intro", label: "부서소개" },
    { path: "/about/career-roadmap", label: "진로·취업 로드맵" },
    { path: "/about/career-program", label: "진로취업 프로그램" },
  ]*/}

  return (
    <div className="about-sidebar">
      <h3 className="sidebar-title">센터소개</h3>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-menu-item">
            <Link to={item.link} className={`sidebar-menu-link ${currentPath === item.link ? "active" : ""}`}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AboutSidebar