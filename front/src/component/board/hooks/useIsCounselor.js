const useIsCounselor = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.userRole === 'COUNSELOR';
};

export default useIsCounselor;