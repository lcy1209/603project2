import { Outlet } from "react-router-dom"
import AboutSidebar from "./AboutSidebar"
import "./AboutLayout.css"

const AboutLayout = () => {
  return (
    <div className="about-layout">
      <AboutSidebar />
      <div className="about-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AboutLayout