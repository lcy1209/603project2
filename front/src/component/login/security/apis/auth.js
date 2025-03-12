import api from "./api";

// 로그인
export const login = (loginid, password) =>
  api.post(`/login`, null, {
    params: { loginid, password },
  });

// 사용자 정보
export const info = () => api.get(`/users/info`);

// 회원가입
export const join = (data) => api.post(`/users`, data);

// 회원 정보 수정
export const update = (data) => api.put(`/users`, data);

// 회원 탈퇴
export const remove = (password) =>
  api.delete(`/users`, {
    data: { password }, // 요청 본문에 비밀번호 포함
  });


// 특정 데이터로 조회 (ex: 아이디, 이메일)
export const getData = (key, value) =>
  api.post(`/users/check/${key}`, { [key]: value });
