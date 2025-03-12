import React from "react"
import { Outlet, Link } from "react-router-dom"
import "./AdminLayout.css"

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/admin">대시보드</Link>
          </li>
          <li>
            <Link to="/admin/banners">배너 관리</Link>
          </li>
          <li>
            <Link to="/mainRecruitment">채용정보 관리</Link>
          </li>
          <li>
            <Link to="/programs">프로그램 관리</Link>
          </li>
        </ul>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout