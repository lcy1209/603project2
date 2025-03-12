import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import './FindPw.css';

const FindPw = () => {
    const [loginid, setLoginid] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isFind, setIsFind] = useState(false);

    // 임시 비밀번호 발급
    const onSendPw = async (e) => {
        e.preventDefault();
        try {
            await axios({
                url: '/users/findPw',
                method: 'post',
                data: {
                    loginid: loginid,
                    email: email,
                },
                baseURL: 'http://localhost:8090',
            }).then((response) => {
                setIsFind(true);
                setErrorMessage('이메일이 정상적으로 발송되었습니다.');
            });
        } catch (error) {
            setErrorMessage('일치하는 사용자가 없습니다.');
            setIsFind(true);
        }
    };

    return (
        <div className="findpw-container">
            {!isFind ? (
                <>
                    <h2>비밀번호 찾기</h2>
                    <form className="findpw-form" onSubmit={onSendPw}>
                        <div className="form-group">
                            <label htmlFor="loginid">아이디</label>
                            <input
                                id="loginid"
                                type="text"
                                placeholder="아이디를 입력해주세요"
                                value={loginid}
                                onChange={(e) => setLoginid(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="이메일을 입력해주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary">비밀번호 찾기</button>
                        <div className="findpw-link">
                            <NavLink to="/find/id">아이디 찾기</NavLink>
                            <span>&nbsp;|&nbsp;</span>
                            <NavLink to="/login">돌아가기</NavLink>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    {errorMessage && <p>{errorMessage}</p>}
                    <NavLink to="/login" className="btn-secondary">돌아가기</NavLink>
                </>
            )}
        </div>

    );
};

export default FindPw;
