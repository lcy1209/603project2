import React, { createContext, useEffect, useState, useCallback } from 'react';
import api from '../apis/api';
import * as auth from '../apis/auth';
import { useNavigate } from 'react-router-dom';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

const LoginContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(false);
    const [isLoginInProgress, setLoginInProgress] = useState(true);
    const [isUserId, setIsUserId] = useState(null);
    const [isGender, setIsGender] = useState(null);
    const [isLoginId, setIsLoginId] = useState(null);
    const [roles, setRoles] = useState(null);
    const [isName, setIsName] = useState(null);  // ✅ 사용자 이름 상태 추가

    // ✅ [1] 로그아웃 처리 (localStorage 사용)
    const logoutSetting = useCallback(() => {
        api.defaults.headers.common.Authorization = undefined;
        localStorage.removeItem("accessToken");  // ✅ Cookies 대신 localStorage 사용
        setLogin(false);
        setIsUserId(null);
        setIsLoginId(null);
        setIsName(null);
        setIsGender(null);
        setRoles({});
    }, []);

    // ✅ [2] 로그인 후 사용자 정보 저장
    const loginSetting = useCallback((userData, accessToken) => {
        const { userId, loginid, name, gender, role } = userData;
        
        localStorage.setItem("accessToken", accessToken); // ✅ Cookies 대신 localStorage 사용
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`; // ✅ 모든 요청에 Authorization 헤더 추가

        setLogin(true);
        setIsUserId(userId);
        setIsLoginId(loginid);
        setIsName(name);
        setIsGender(gender);
        setRoles(role);

        // if (Array.isArray(userRoles)) {
        //     setRoles(userRoles.reduce((acc, role) => ({ ...acc, [role]: true }), {}));
        // } else {
        //     console.warn("Invalid roles data:", userRoles);
        //     setRoles({});
        // }
    }, []);

    // ✅ [3] 로그인 체크 (localStorage 사용)
    const loginCheck = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken"); // ✅ Cookies 대신 localStorage 사용
        if (!accessToken) {
            logoutSetting();
            return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`; // ✅ 모든 요청에 Authorization 헤더 추가
        try {
            const response = await auth.info();
            if (response.data === 'UNAUTHORIZED') {
                throw new Error("Unauthorized");
            }
            loginSetting(response.data, accessToken);
        } catch (error) {
            console.error("Error during login check:", error);
            logoutSetting();
        }
    }, [logoutSetting, loginSetting]);

    // ✅ [4] 로그인 체크 실행
    useEffect(() => {
        setLoginInProgress(true);
        loginCheck().finally(() => setLoginInProgress(false));
    }, [loginCheck]);

    // ✅ [5] 로그인 요청
    const login = async (loginid, password) => {
        try {
            const response = await auth.login(loginid, password);
            const authHeader = response.headers.authorization;

            if (!authHeader) {
                throw new Error("Authorization 헤더가 없습니다.");
            }

            const accessToken = authHeader.replace("Bearer ", "");
            localStorage.setItem("accessToken", accessToken); // ✅ Cookies 대신 localStorage 사용

            await loginCheck();
            alert("로그인 성공! 메인 화면으로 이동합니다.");
            navigate("/");
        } catch (error) {
            console.error(`로그인 중 오류 발생: ${error.message}`);
            alert("로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    // ✅ [6] 로그아웃 처리
    const logout = (force = false) => {
        if (force || window.confirm("로그아웃하시겠습니까?")) {
            logoutSetting();
            navigate("/");
        }
    };

    return (
        <LoginContext.Provider value={{ 
            isLogin, 
            isLoginInProgress, 
            isUserId, 
            isLoginId, 
            isName,  
            isGender, 
            roles, 
            login, 
            logout 
        }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;
