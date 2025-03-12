import "../../common/css/PostDetailView.css";
import "../../common/css/Button.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import useIsAdmin from "../../../hooks/useIsAdmin";
import { LoginContext } from "../../../../login/security/contexts/LoginContextProvider";

const CounselDetailView = () => {
    const isAdmin = useIsAdmin();
    const { id } = useParams();
    const navigate = useNavigate();
    const [counsel, setCounsel] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const { isName, roles } = useContext(LoginContext);

    useEffect(() => {
        const fetchCounselDetail = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/counsel/${id}`);
                setCounsel(response.data);

                // 현재 로그인한 사용자가 작성자인지 확인
                setIsAuthor(isName === response.data.author);
            } catch (error) {
                console.error('Error fetching counsel detail:', error);
            }
        };

        fetchCounselDetail();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${SERVER_URL}/api/counsel/${id}`);
                navigate('/counsel/online');
            } catch (error) {
                console.error('Error deleting counsel:', error);
            }
        }
    };

    const handleAnswerDelete = async () => {
        if (window.confirm('답변을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${SERVER_URL}/api/counsel/${id}/answer`);
                window.location.reload();
            } catch (error) {
                console.error('Error deleting answer:', error);
            }
        }
    };

    return (
        <div className="common-detail-board-container">
            <h1>상담 상세 내용</h1>
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{counsel?.title}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{counsel?.author}</td>
                    </tr>
                    <tr>
                        <th>작성일자</th>
                        <td>{counsel?.createdDate?.replace('T', ' ')}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{counsel?.content}</td>
                    </tr>
                    {/* 구분선 추가 */}
                    {counsel?.answer && (
                        <tr>
                            <td colSpan="2" style={{ borderTop: '2px solid #ddd', padding: '10px 0' }}></td>
                        </tr>
                    )}

                    {/* 답변 섹션 */}
                    {counsel?.answer && (
                        <>
                            <tr>
                                <th>답변자</th>
                                <td>{counsel.answerer}</td>
                            </tr>
                            <tr>
                                <th>답변일자</th>
                                <td>{counsel.answerDate?.replace('T', ' ')}</td>
                            </tr>
                            <tr>
                                <th>답변</th>
                                <td className="answer-text">
                                    {counsel.answer}
                                </td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
            <div className="common-button-container">
                {/* 답변이 없고 작성자인 경우 수정/삭제 버튼 표시 */}
                {!counsel?.answer && isAuthor && (
                    <>
                        <button onClick={() => navigate(`/counsel/online/edit/${id}`)}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}

                {/* 답변이 없고 관리자인 경우 답변작성 버튼 표시 */}
                {!counsel?.answer && isAdmin && (
                    <>
                        <button onClick={() => navigate(`/counsel/online/answer/${id}`)}>답변작성</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}

                {/* 답변이 있고 관리자인 경우 답변 수정/삭제 버튼 표시 */}
                {counsel?.answer && isAdmin && (
                    <>
                        <button onClick={() => navigate(`/counsel/online/answer/edit/${id}`)}>답변수정</button>
                        <button onClick={handleAnswerDelete}>답변삭제</button>
                    </>
                )}

                <button onClick={() => navigate('/counsel/online')}>목록</button>
            </div>
        </div>
    );
};

export default CounselDetailView;
