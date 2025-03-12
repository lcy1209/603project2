import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8090',
});

// ✅ 요청을 보낼 때마다 Authorization 헤더에 JWT 포함
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // ✅ localStorage 사용
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
