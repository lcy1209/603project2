import { useContext } from 'react';
import { LoginContext } from '../../login/security/contexts/LoginContextProvider';

const useIsAdmin = () => {
    const { roles } = useContext(LoginContext);
    return roles === "ROLE_ADMIN"; // 관리자 권한 확인
};

export default useIsAdmin;