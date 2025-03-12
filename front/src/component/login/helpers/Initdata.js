import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Initdata = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지

  useEffect(() => {
    const initializeData = async () => {
      try {
        await axios.post('/users/initdata'); // 서버에 초기화 요청
        navigate('/'); // 성공 시 메인 페이지로 이동
      } catch (error) {
        console.error('Error during initialization:', error);
        setError('초기화 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    initializeData();
  }, [navigate]);

  // 로딩 상태 표시
  if (loading) {
    return <div>초기 데이터를 설정 중입니다...</div>;
  }

  // 에러 메시지 표시
  if (error) {
    return <div>{error}</div>;
  }

  // 리다이렉션되기 때문에 기본적으로 이 상태는 표시되지 않음
  return null;
};

export default Initdata;
