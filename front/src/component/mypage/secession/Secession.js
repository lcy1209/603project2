import React, { useState, useEffect } from 'react';
import './Secession.css';
import Sidebar from '../page/Sidebar';
import { remove } from '../../login/security/apis/auth';

const Secession = () => {
    const [password, setPassword] = useState(''); // 비밀번호 입력 상태
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태
    const [loading, setLoading] = useState(false); // 요청 상태
    const [error, setError] = useState(false); // ❌ 비밀번호 오류 상태 추가
    
    // 🔹 회원탈퇴 페이지 진입 시 비밀번호 입력칸을 빈칸으로 유지
    useEffect(() => {
        setPassword('');
    }, []); // 컴포넌트가 처음 렌더링될 때만 실행

    // ❌ 비밀번호 오류 시 자동 초기화
    useEffect(() => {
        if (error) {
            setPassword('');
            setError(false); // 다음 입력을 위해 error 상태 초기화
        }
    }, [error]);

    // 🔹 비밀번호 입력 핸들러 (공백 유지)
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // 🔹 회원탈퇴 요청
    const handleSubmit = async (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            console.log('회원탈퇴 요청 시작:', { password });

            // 🔹 회원탈퇴 API 요청
            const response = await remove(password);
            console.log('회원탈퇴 요청 응답:', response);

            if (response.status === 200) {
                alert('회원탈퇴가 성공적으로 처리되었습니다.');

                // 🔹 ✅ 로컬 스토리지 초기화
            localStorage.removeItem("token");  // JWT 토큰 삭제
            localStorage.removeItem("user");   // 사용자 정보 삭제

            // 🔹 ✅ 상태 초기화 (전역 상태 사용 시)
            window.location.href = "/";  // 메인 화면으로 이동

            } else {
                alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('회원탈퇴 요청 실패:', error);
            const status = error.response?.status;

            if (status === 401) {
                alert('비밀번호가 올바르지 않습니다. 다시 입력해주세요.');
                setError(true); // ❌ 에러 상태를 true로 설정 (useEffect에서 처리)
            } else if (status === 500) {
                alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
            } else {
                alert('회원탈퇴 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="secession-container">
                <main className="secession-main">
                    <Sidebar />
                    <section className="secession-form-container" style={{ width: "75%", padding: "20px" }}>
                        <h1>회원 탈퇴</h1>
                        <div className="secession-division-line"></div>
                        <form onSubmit={handleSubmit}>
                            <div className="secession-text">
                                그동안 서비스를 이용해 주셔서 대단히 감사합니다.
                                <br />
                                회원 탈퇴를 하시면 회원님의 모든 정보가 완전히 삭제됩니다.
                                <br />
                                또한 탈퇴 시, 사용한 아이디로 재가입이 되지 않으니 이 점 양해 부탁드립니다.
                            </div>
                            <div className="secession-line"></div>
                            <label
                                htmlFor="password"
                                style={{ width: "50%", margin: "auto", fontSize: "19px", fontWeight: "bold" }}
                            >
                                비밀번호 확인
                            </label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password} // 🔹 항상 빈칸 유지됨
                                    onChange={handlePasswordChange}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                    className="password-input"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label="비밀번호 표시 토글"
                                >
                                    {showPassword ? '🔓' : '🔒'}
                                </button>
                            </div>
                            <button type="submit" className="secession-button" disabled={loading}>
                                {loading ? '탈퇴 처리 중...' : '회원 탈퇴'}
                            </button>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Secession;
