import React from "react"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null // 실제 구현에서는 더 안전한 인증 확인 방법을 사용해야 합니다
  const isAdmin = localStorage.getItem("userRole") === "admin" // 수정된 부분
  const location = useLocation()

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />
  // }

  // if (!isAdmin) {
  //   return <Navigate to="/" replace />
  // }

  return children
}

export default ProtectedRoute