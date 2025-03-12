import useAuth from "../hooks/useAuth";

/**
 * 현재 로그인 상태에 맞는 Conditional rendering 제공. 
 * loginStatus가 일치할 경우 children을 렌더링하고, 일치하지 않으면 fallback을 렌더링.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @param {import("../hooks/useAuth").LoginStatus | import("../hooks/useAuth").LoginStatus[]} props.loginStatus - 
 * 로그인 상태가 일치하거나 배열에 포함된 경우 컴포넌트 렌더링
 * @param {import("../hooks/useAuth").Roles | import("../hooks/useAuth").Roles[] | null} props.roles - 
 * 권한이 일치하거나 배열에 포함된 경우 렌더링. null이면 무시됨
 * @param {React.ReactNode} [props.fallback=null] - 조건이 맞지 않을 경우 렌더링할 컴포넌트
 * 
 * @returns {React.JSX.Element}
 */
export default function Auth({
    children,
    loginStatus,
    roles = null,
    fallback = null,
}) {
    const { loginStatus: currentLoginStatus, roles: currentRoles } = useAuth();

    const loginStatusArray = Array.isArray(loginStatus) ? loginStatus : [loginStatus];
    const rolesArray = roles ? (Array.isArray(roles) ? roles : [roles]) : [];

    const loginStatusMatches = loginStatusArray.includes(currentLoginStatus);
    const rolesMatches = rolesArray.length === 0 || rolesArray.some(role => role === currentRoles);

    return loginStatusMatches && rolesMatches ? <>{children}</> : fallback;
}
