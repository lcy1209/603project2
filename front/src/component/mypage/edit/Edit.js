import React, { useState, useEffect } from 'react';
import api from '../../login/security/apis/api'; 
import './Edit.css';
import Sidebar from '../page/Sidebar';

const PersonInfoEdit = () => {
  const [userInfo, setUserInfo] = useState({
    loginid: '',
    name: '',
    email: '',
    gender: '',
    phone: '',
    depart: '',
  });
  const [currentPassword, setCurrentPassword] = useState(''); // 기존 비밀번호
  const [newPassword, setNewPassword] = useState(''); // 새로운 비밀번호
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // 사용자 정보 로드
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users/info');
        const userData = response.data;
  
        // 비밀번호 필드 제거
        if ('password' in userData) {
          delete userData.password;
        }
  
        setUserInfo(userData);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };
    fetchUserInfo();
  }, []);
  
  // 전화번호 포맷팅
  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // 숫자만 남기기
    let formattedPhone = input;

    if (input.length > 3 && input.length <= 7) {
      formattedPhone = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length > 7) {
      formattedPhone = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
    }
    setUserInfo((prev) => ({ ...prev, phone: formattedPhone }));
  };

  // 회원정보 & 비밀번호 업데이트 (현재 비밀번호 확인)
  const handleUpdate = async () => {
    setLoading(true);

    // 현재 비밀번호를 입력하지 않으면 경고창 띄우기
    if (!currentPassword) {
      alert('현재 비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    // 현재 비밀번호와 새 비밀번호가 같으면 경고창 띄우기
    if (currentPassword === newPassword) {
      alert('현재 비밀번호와 새 비밀번호가 동일합니다.');
      setLoading(false);
      return;
    }

    try {

      // 현재 비밀번호 확인 요청 (실패 시 예외 발생)
      await api.post('/users/verify-password', { password: currentPassword });

      // 회원정보 수정
      const userData = { ...userInfo };
      await api.put('/users', userData);
      alert('회원정보가 성공적으로 수정되었습니다.');
  
      // 비밀번호 변경 (새 비밀번호 입력 시)
      if (currentPassword && newPassword) {
        const passwordUpdateData = { currentPassword, newPassword };
        await api.put('/users/password', passwordUpdateData);
        alert('비밀번호가 성공적으로 변경되었습니다.');
  
        // 비밀번호 변경 후 사용자 정보 새로고침
        const refreshedUserInfo = await api.get('/users/info');
        delete refreshedUserInfo.data.password; // 비밀번호 필드 제거
        setUserInfo(refreshedUserInfo.data); // 최신 사용자 정보로 업데이트
      }
    } catch (error) {
      console.error('수정 실패:', error.response?.data || error.message);
      alert(`수정 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      await handleUpdate(); // 회원정보 및 비밀번호 수정
      setCurrentPassword(''); // 현재 비밀번호 초기화
      setNewPassword(''); // 새 비밀번호 초기화
    } catch (error) {
      console.error('수정 중 오류 발생:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="myedit-container">
        <main className='myedit-main'>
          <Sidebar />

          <section className="myedit-form-container">
            <h2>개인정보 수정</h2>
            <div className="myedit-division-line"></div>
            
            <form onSubmit={handleSubmit}>
              <label htmlFor="loginid">아이디</label>
              <input type="text" id="loginid" value={userInfo.loginid} disabled />

              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, name: e.target.value }))}
                required
              />

              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                required
              />

              <label htmlFor="gender">성별</label>
              <input
                type="text"
                id="gender"
                value={userInfo.gender === 'MALE' ? '남성' : '여성'}
                disabled
                autoComplete="off"
              />

              <label htmlFor="current-password">현재 비밀번호</label>
              <div className="myedit-eye-password-container">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? '🔓' : '🔒'}
                </button>
              </div>

              <label htmlFor="new-password">새 비밀번호</label>
              <div className="myedit-eye-password-container">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? '🔓' : '🔒'}
                </button>
              </div>

              <label htmlFor="depart">학과명</label>
              <input type="text" id="depart" value={userInfo.depart} disabled />

              <label htmlFor="phone">전화번호</label>
              <input
                type="tel"
                id="phone"
                value={userInfo.phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? '처리 중...' : '회원정보 수정'}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PersonInfoEdit;
