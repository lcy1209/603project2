import { useNavigate } from "react-router-dom";
import useAuth, { LOGIN_STATUS, ROLES } from "../useAuth";
import { useEffect } from "react";

// 기본 사용 예시
const UseAuthBasic = () => {
    const { loginStatus, userId, roles } = useAuth();

    const status_message = {
        [LOGIN_STATUS.LOGGED_IN]: "로그인됨.",
        [LOGIN_STATUS.LOGGED_OUT]: "로그아웃 됨.",
        [LOGIN_STATUS.LOGIN_PENDING]: "로그인 진행중.",
    }[loginStatus] || "상태를 알 수 없습니다.";

    const roles_message = {
        [ROLES.USER]: "일반 사용자.",
        [ROLES.ADMIN]: "어드민 사용자.",
        [ROLES.UNKNOWN]: "알 수 없음.",
    }[roles] || "알 수 없는 권한입니다.";

    return (
        <>
            <div>로그인 상태: {status_message}</div>
            <div>사용자 아이디: {userId}</div>
            <div>권한: {roles_message}</div>
        </>
    );
};

// 로그인 또는 권한 확인 훅
const useCheckAuth = (requiredRole = null) => {
    const { loginStatus, roles } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginStatus === LOGIN_STATUS.LOGGED_OUT) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        if (loginStatus === LOGIN_STATUS.LOGGED_IN && requiredRole && roles !== requiredRole) {
            alert("권한이 없습니다.");
            navigate(-1);
        }
    }, [loginStatus, roles, requiredRole, navigate]);
};

// 로그인 되어있는지 확인 예시
const UseAuthCheckLogin = () => {
    useCheckAuth(); // 로그인만 확인
    return null;
};

// 어드민인지 확인하는 예시
const UseAuthCheckAdmin = () => {
    useCheckAuth(ROLES.ADMIN); // 어드민 권한 확인
    return null;
};

export { UseAuthBasic, UseAuthCheckLogin, UseAuthCheckAdmin };
