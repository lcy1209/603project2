import { useEffect, useState } from "react";
import useAuth, { LOGIN_STATUS } from "./useAuth";

export default function useRealName() {
    const { loginStatus, axios } = useAuth();
    const [name, setName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchName = async () => {
        if (!axios) return; // axios 인스턴스가 없으면 실행하지 않음

        setLoading(true);
        setError(null); // 이전 에러 초기화

        try {
            const resp = await axios.get("/api/reservations/get_name");
            setName(resp.data);
        } catch (err) {
            console.error("Failed to fetch name:", err);
            setError(err.message || "이름을 가져오는 데 실패했습니다.");
            setName(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loginStatus === LOGIN_STATUS.LOGGED_IN && axios) {
            fetchName();
        }
    }, [loginStatus, axios]);

    return { name, loading, error }; // 로딩 상태와 에러 상태도 반환
}
