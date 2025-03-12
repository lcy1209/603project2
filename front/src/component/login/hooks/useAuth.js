import { useContext, useMemo } from "react";
import { LoginContext } from "../security/contexts/LoginContextProvider";
import authAxios from "../security/apis/api";

const LOGIN_STATUS = Object.freeze({
    LOGIN_PENDING: 0, // 로그인 진행 중
    LOGGED_IN: 1,     // 로그인됨
    LOGGED_OUT: 2,    // 로그아웃됨
});

const ROLES = Object.freeze({
    UNKNOWN: 0, // 알 수 없음
    USER: 1,    // 일반 사용자
    ADMIN: 2,   // 관리자
});

const login_status_from_context = (isLogin, isLoginInProgress) =>
    isLoginInProgress ? LOGIN_STATUS.LOGIN_PENDING : isLogin ? LOGIN_STATUS.LOGGED_IN : LOGIN_STATUS.LOGGED_OUT;

const roles_from_context = (roles) => {
    if (roles?.isUser) return ROLES.USER;
    if (roles?.isAdmin) return ROLES.ADMIN;
    return ROLES.UNKNOWN;
};

const useAuth = () => {
    const {
        isLogin,
        isLoginInProgress,
        isUserId,
        isLoginId,
        isName, // ✅ name 가져오기
        isGender,
        roles,
        loginCheck: _,
        login,
        logout,
    } = useContext(LoginContext);

    const loginStatus = login_status_from_context(isLogin, isLoginInProgress);

    const axiosInstance = useMemo(() => {
        if (loginStatus === LOGIN_STATUS.LOGGED_IN) {
            return authAxios;
        }
        return null;
    }, [loginStatus]);

    const handleLogout = (ask = true) => {
        if (ask && !window.confirm("로그아웃하시겠습니까?")) return;
        logout(true);
    };

    return {
        loginStatus,
        userId: loginStatus === LOGIN_STATUS.LOGGED_IN ? isUserId : null,
        loginId: loginStatus === LOGIN_STATUS.LOGGED_IN ? isLoginId : null,
        gender: loginStatus === LOGIN_STATUS.LOGGED_IN ? isGender : null,
        name: loginStatus === LOGIN_STATUS.LOGGED_IN ? isName : null,
        roles: loginStatus === LOGIN_STATUS.LOGGED_IN ? roles_from_context(roles) : null,
        axios: axiosInstance,
        login: loginStatus === LOGIN_STATUS.LOGGED_OUT ? login : null,
        logout: loginStatus === LOGIN_STATUS.LOGGED_IN ? handleLogout : null,
    };
};

export default useAuth;
export { LOGIN_STATUS, ROLES };
