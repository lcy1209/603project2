import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/api";

const KakaoRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getKakaoToken = async () => {
            const code = new URL(window.location.href).searchParams.get("code");
            if (!code) {
                console.error("❌ 카카오 인가 코드 없음!");
                return;
            }

            try {
                console.log("🟢 카카오 로그인 요청 시작...");
                const response = await api.get(`/oauth/kakao/callback?code=${code}`);
                console.log("🟢 카카오 응답 데이터:", response.data);

                if (!response.data.accessToken) {
                    console.error("❌ JWT 토큰이 없음!");
                    return;
                }

                // ✅ JWT 저장
                localStorage.setItem("accessToken", response.data.accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

                console.log("✅ JWT 저장 완료! 메인 페이지로 이동...");
                alert("카카오 로그인 성공!");
                navigate("/"); // ✅ 로그인 후 메인 페이지로 이동
            } catch (error) {
                console.error("❌ 카카오 로그인 중 오류 발생:", error);
                alert("카카오 로그인 실패! 다시 시도해주세요.");
                navigate("/kakao-login");
            }
        };

        getKakaoToken();
    }, [navigate]);

    return <div>카카오 로그인 중...</div>;
};

export default KakaoRedirect;
