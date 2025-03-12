import FormJoin from '../components/Join/FormJoin';
import * as auth from '../apis/auth';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const navigate = useNavigate();

  // 회원가입 요청
  const join = async (form) => {
    try {
      const response = await auth.join(form);
      if (response.status === 201) {
        alert("가입이 완료되었습니다.");
        navigate("/login", { replace: true });
      } else {
        alert("회원가입에 실패하였습니다.");
      }
    } catch (error) {
      console.error(`회원가입 요청 중 에러: ${error.message}`);
      alert("회원가입 요청 중 문제가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  // 중복 체크 통합 함수
  const checkDuplicate = async (type, value) => {
    const form = { [type]: value };
    try {
      const response = await auth.getData(form);
      if (response.status === 200) {
        alert(`사용 가능한 ${type === 'loginid' ? '아이디' : '이메일'}입니다.`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert(`사용할 수 없는 ${type === 'loginid' ? '아이디' : '이메일'}입니다.`);
      } else {
        alert("조회 중 오류가 발생하였습니다.");
      }
    }
  };

  return (
    <>
      <div className='container'>
        <FormJoin
          join={join}
          checkId={(id) => checkDuplicate("loginid", id)}
          checkEmail={(email) => checkDuplicate("email", email)}
        />
      </div>
    </>
  );
};

export default Join;
