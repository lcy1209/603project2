import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../apis/api';
import './FindId.css';

const FindId = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [foundLoginId, setFoundLoginId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFind, setIsFind] = useState(false);

  // 아이디 찾기 핸들러
  const onFindId = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 에러 메시지 초기화
    setFoundLoginId(''); // 이전 검색 결과 초기화

    try {
      const response = await api.post('/users/findId', {
        name: name,
        email: email,
      });

      setFoundLoginId(response.data); // 성공 시 사용자 ID 설정
      setIsFind(true);
    } catch (error) {
      setErrorMessage('일치하는 사용자가 없습니다.'); // 에러 메시지 설정
      setIsFind(true);
    }
  };

  // 아이디 찾기 폼 렌더링
  if (!isFind) {
    return (
      <div className="find-id-container">
        <h2>아이디 찾기</h2>
        <form onSubmit={onFindId} className="find-id-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="이름을 입력해주세요"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="이메일을 입력해주세요"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">아이디 찾기</button>
          <div className="find-id-link">
            <NavLink to="/find/pw">비밀번호 찾기</NavLink>
            <span>&nbsp;|&nbsp;</span>
            <NavLink to="/login">돌아가기</NavLink>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="find-id-container">
        {foundLoginId && <p>사용자 아이디: {foundLoginId}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <NavLink to="/login" className="btn-secondary">돌아가기</NavLink>
      </div>
    );
  }
};

export default FindId;
