import React, { useContext, useEffect, useState } from 'react';
import FormUser from '../components/User/FormUser';
import * as auth from '../apis/auth';
import { LoginContext } from '../contexts/LoginContextProvider';
// import Header from '../../header/header';

const User = () => {
    const [userInfo, setUserInfo] = useState(null); // 사용자 정보
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const { logout } = useContext(LoginContext);

    // 사용자 정보 조회 
    const getUserInfo = async () => {
        try {
            const response = await auth.info();
            setUserInfo(response.data);
        } catch (error) {
            console.error("사용자 정보 조회 중 오류 발생:", error.message);
            alert("사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    // 회원 정보 수정
    const updateUser = async (form) => {
        try {
            const response = await auth.update(form);
            if (response.status === 200) {
                alert("회원 정보가 성공적으로 수정되었습니다. 로그아웃 후 다시 로그인해주세요.");
                logout(true); // 강제 로그아웃
            } else {
                alert("회원 정보 수정에 실패하였습니다.");
            }
        } catch (error) {
            console.error("회원 정보 수정 중 오류 발생:", error.message);
            alert("회원 정보를 수정하는 도중 문제가 발생했습니다.");
        }
    };

    // 회원 탈퇴
    const deleteUser = async (userId) => {
        if (!window.confirm("정말로 회원 탈퇴하시겠습니까?")) {
            return; // 사용자 취소 시 중단
        }

        try {
            const response = await auth.remove(userId);
            if (response.status === 200) {
                alert("회원 탈퇴가 성공적으로 완료되었습니다.");
                logout(true); // 강제 로그아웃
            } else {
                alert("회원 탈퇴에 실패하였습니다.");
            }
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error.message);
            alert("회원 탈퇴 도중 문제가 발생했습니다.");
        }
    };

    useEffect(() => {
        getUserInfo(); // 컴포넌트 로드 시 사용자 정보 조회
    }, []);

    // 로딩 중 표시
    if (isLoading) {
        return <div className="loading">로딩 중입니다...</div>;
    }

    // 사용자 정보가 없을 경우 처리
    if (!userInfo) {
        return <div className="error">사용자 정보를 불러오지 못했습니다.</div>;
    }

    return (
        <div className='container'>
            {/* <Header /> */}
            <FormUser
                userInfo={userInfo}
                updateUser={updateUser}
                deleteUser={deleteUser}
            />
        </div>
    );
};

export default User;
