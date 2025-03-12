import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../../contexts/LoginContextProvider";
import './FormLogin.css';

const FormLogin = () => {
    const { login } = useContext(LoginContext);

    const handleLogin = (e) => {
        e.preventDefault();

        const form = e.target;
        const loginid = form.loginid.value.trim();
        const password = form.password.value.trim();

        if (loginid === "" || password === "") {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        login(loginid, password);
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="login-input">
                    <label htmlFor="loginid">아이디</label>
                    <input
                        type="text"
                        id="loginid"
                        placeholder="아이디를 입력해주세요"
                        name="loginid"
                        autoComplete="username"
                        required
                    />
                </div>
                <div className="login-input">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="비밀번호를 입력해주세요"
                        name="password"
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="link">
                    <NavLink to="/find/id">아이디 찾기</NavLink>
                    <span>&nbsp;|&nbsp;</span>
                    <NavLink to="/find/pw">비밀번호 찾기</NavLink>
                    <span>&nbsp;|&nbsp;</span>
                    <NavLink to="/join">회원가입</NavLink>
                </div>
            </form>
        </div>
    );
};

export default FormLogin;
