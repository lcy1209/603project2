import React from "react";
import "./KakaoLogin.css"; // ✅ 스타일 적용

const KakaoLogin = () => {
    const REST_API_KEY = "8e2b98f25d68fd69bcd2836620b22739"; 
    const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback"; 
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL; 
    };

    return (
        <div className="kakao-login-container">
            <button className="kakao-login-button" onClick={handleKakaoLogin}>
                <img src="/images/kakao_login_large.png" alt="카카오 로그인" />
            </button>
        </div>
    );
};

export default KakaoLogin;
