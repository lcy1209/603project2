import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth, { LOGIN_STATUS } from '../hooks/useAuth';

/**
 * 로그인이 되어있지 않으면 alert 표출후 로그인 페이지로 Redirect함.
 * @returns {React.JSX.Element}
 */
export default function RedirectLogin() {
    const { loginStatus } = useAuth();

    // 로그인 상태가 진행 중인 경우 아무것도 렌더링하지 않음
    if (loginStatus === LOGIN_STATUS.LOGIN_PENDING) {
        return null;
    }

    // 로그아웃 상태인 경우
    if (loginStatus === LOGIN_STATUS.LOGGED_OUT) {
        // Toast나 별도의 알림 컴포넌트로 메시지를 대체 가능
        alert("로그인이 필요합니다.");
        return <Navigate to="/login" replace />;
    }

    // 로그인 상태인 경우
    return null;
}
