import React, { useState, useEffect } from 'react';
import { getData } from '../../apis/auth';
import './FormJoin.css';

const FormJoin = ({ join }) => {
    const [formData, setFormData] = useState({
        loginid: '',
        password: '',
        password2: '',
        name: '',
        phone: '',
        email: '',
        email1: '',
        email2: 'naver.com',
        depart: '',
        gender: 'male',
        sms: true, // boolean으로 설정
    });

    const [inputDisable, setInputDisable] = useState({
        isLoginid: false,
        isEmail: false,
    });

    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [validateCk, setValidateCk] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const formattedPhone = formatPhone(value);
            setFormData({ ...formData, phone: formattedPhone });
        } else {
            setFormData({
                ...formData,
                [name]: name === 'sms' ? value === 'true' : value, // sms는 boolean으로 처리
            });
        }
    };

    const onJoin = (e) => {
        e.preventDefault();
        console.log("전송 데이터:", formData);
        onValidate();
        if (validateCk) {
            join(formData);
        }
    };


    const onCheckId = async () => {
        if (!formData.loginid.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const response = await getData("loginid", formData.loginid);
            if (response.status === 200) {
                alert("사용 가능한 아이디입니다.");
                setInputDisable((prevState) => ({ ...prevState, isLoginid: true }));
            }
        } catch (error) {
            if (error.response?.status === 409) {
                alert("사용 할 수 없는 아이디입니다.");
            } else {
                alert("조회 중 오류가 발생하였습니다.");
            }
        }
    };



    const onCheckEmail = async () => {
        if (!formData.email1.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        try {
            const response = await getData("email", formData.email);
            if (response.status === 200) {
                alert("사용 가능한 이메일입니다.");
                setInputDisable({ ...inputDisable, isEmail: true });
            }
        } catch (error) {
            if (error.response?.status === 409) {
                alert("사용 할 수 없는 이메일입니다.");
            } else {
                alert("이메일 조회 중 오류가 발생했습니다.");
            }
        }
    };


    useEffect(() => {
        setFormData({ ...formData, email: `${formData.email1}@${formData.email2}` });
    }, [formData.email1, formData.email2]);

    const onCheckPassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d|(?=.*\W)).{8,16}$/;
        return regex.test(password);
    };

    const onMatchPassword = () => {
        setPasswordMatch(formData.password === formData.password2);
    };

    useEffect(() => {
        const isValid = onCheckPassword(formData.password);
        setPasswordValid(isValid);
        onMatchPassword();
    }, [formData.password, formData.password2]);

    const formatPhone = (str) => {
        str = str.replace(/[^0-9]/g, '');
        let tmp = '';
        if (str.length < 4) return str;
        if (str.length < 7) tmp = `${str.substr(0, 3)}-${str.substr(3)}`;
        else if (str.length < 11) tmp = `${str.substr(0, 3)}-${str.substr(3, 3)}-${str.substr(6)}`;
        else tmp = `${str.substr(0, 3)}-${str.substr(3, 4)}-${str.substr(7)}`;
        return tmp;
    };

    const onValidate = () => {
        if (!formData.loginid.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }
        if (!formData.password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        if (!formData.password2.trim()) {
            alert("비밀번호 확인을 입력해주세요.");
            return;
        }
        if (!formData.email1.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }
        if (!formData.name.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }
        if (!formData.phone.trim()) {
            alert("핸드폰 번호를 입력해주세요.");
            return;
        }
        if (!formData.depart.trim()) {
            alert("학과를 입력해주세요.");
            return;
        }
        if (!inputDisable.isLoginid) {
            alert("아이디 중복 체크를 완료해주세요.");
            return;
        }
        if (!inputDisable.isEmail) {
            alert("이메일 중복 체크를 완료해주세요.");
            return;
        }
        setValidateCk(true);
    };
    return (
        <div className="join-form-container">
            <h2 className="join-title">회원가입</h2>

            <form className="join-form" onSubmit={onJoin}>
                {/* 사용자 ID */}
                <div className="join-form-row">
                    <label htmlFor="loginid">사용자ID</label>
                    <input
                        id="loginid"
                        type="text"
                        placeholder="아이디"
                        name="loginid"
                        value={formData.loginid}
                        onChange={handleChange}
                        disabled={inputDisable.isLoginid}
                    />
                    <button
                        type="button"
                        disabled={inputDisable.isLoginid}
                        onClick={onCheckId}
                    >
                        아이디체크
                    </button>
                </div>

                {/* 비밀번호 */}
                <div className="join-form-row">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                        minLength={8}
                        maxLength={16}
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <p className={passwordValid ? '' : 'show'}>
                    8자 이상 16자 이하로 영문자, 숫자, 특수문자 중 두 가지 이상 포함해야 합니다.
                </p>

                {/* 비밀번호 확인 */}
                <div className="join-form-row">
                    <label htmlFor="password2">비밀번호확인</label>
                    <input
                        id="password2"
                        type="password"
                        placeholder="비밀번호 확인"
                        name="password2"
                        minLength={8}
                        maxLength={16}
                        value={formData.password2}
                        onChange={handleChange}
                    />
                </div>
                <p className={passwordMatch ? '' : 'show'}>비밀번호가 일치하지 않습니다.</p>

                {/* 이름 */}
                <div className="join-form-row">
                    <label htmlFor="name">이름</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="이름"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* 학과 */}
                <div className="join-form-row">
                    <label htmlFor="depart">학과</label>
                    <input
                        id="depart"
                        type="text"
                        placeholder="학과"
                        name="depart"
                        value={formData.depart}
                        onChange={handleChange}
                    />
                </div>

                {/* 핸드폰 번호 */}
                <div className="join-form-row">
                    <label htmlFor="phone">핸드폰 번호</label>
                    <input
                        id="phone"
                        type="text"
                        placeholder="000-0000-0000"
                        name="phone"
                        maxLength={15}
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                {/* 이메일 */}
                <div className="join-form-row join-email">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        placeholder="이메일"
                        name="email1"
                        value={formData.email1}
                        onChange={handleChange}
                        disabled={inputDisable.isEmail}
                    />
                    <span>@</span>
                    <select
                        value={formData.email2}
                        name="email2"
                        disabled={inputDisable.isEmail}
                        onChange={handleChange}
                    >
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="hanmail.net">hanmail.net</option>
                        <option value="nate.com">nate.com</option>
                    </select>
                    <button type="button" onClick={onCheckEmail}>
                        이메일체크
                    </button>
                </div>

                {/* 성별 */}
                <div className="join-form-row join-radio gender">
                    <label>성별</label>
                    <input
                        type="radio"
                        id="male"
                        value="male"
                        name="gender"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                    />
                    <label htmlFor="male" className="check-label">
                        남성
                    </label>
                    <input
                        type="radio"
                        id="female"
                        value="female"
                        name="gender"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                    />
                    <label htmlFor="female" className="check-label">
                        여성
                    </label>
                </div>

                {/* SMS 수신 동의 */}
                <div className="join-form-row join-radio sms">
                    <label htmlFor="sms">SMS 수신</label>
                    <input
                        type="radio"
                        id="sms_yes"
                        value={true}
                        name="sms"
                        checked={formData.sms === true}
                        onChange={handleChange}
                    />
                    <label htmlFor="sms_yes" className="check-label">
                        동의
                    </label>
                    <input
                        type="radio"
                        id="sms_no"
                        value={false}
                        name="sms"
                        checked={formData.sms === false}
                        onChange={handleChange}
                    />
                    <label htmlFor="sms_no" className="check-label">
                        비동의
                    </label>
                </div>

                {/* 버튼 */}
                <div className="join-buttons">
                    <button
                        type="button"
                        className="btn-back"
                        onClick={() => (window.location.href = '/login')}
                    >
                        돌아가기
                    </button>
                    <button type="submit" className="btn-login">
                        회원가입
                    </button>
                </div>
            </form>
        </div>

    );
}

export default FormJoin;