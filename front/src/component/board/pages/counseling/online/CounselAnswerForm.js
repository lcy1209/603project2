import '../../common/css/PostWriteForm.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import { LoginContext } from '../../../../login/security/contexts/LoginContextProvider';

const CounselAnswerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [counsel, setCounsel] = useState(null);
    const [answer, setAnswer] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const { isName } = useContext(LoginContext);

    useEffect(() => {
        const fetchCounsel = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/counsel/${id}`);
                setCounsel(response.data);
                // 기존 답변이 있으면 수정 모드로 설정하고 답변 내용 불러오기
                if (response.data.answer) {
                    setIsEdit(true);
                    setAnswer(response.data.answer);
                }
            } catch (error) {
                console.error('Error fetching counsel:', error);
            }
        };
        fetchCounsel();
    }, [id]);

    // 글 저장/수정 처리
    const handleSubmit = async () => {
        if (!answer.trim()) {
            alert('답변을 입력해주세요.');
            return;
        }

        try {
            if (isEdit) {
                // 답변 수정
                await axios.put(`${SERVER_URL}/api/counsel/${id}/answer`, {
                    answer: answer,
                    answerer: isName
                });
            } else {
                // 새 답변 작성
                await axios.post(`${SERVER_URL}/api/counsel/${id}/answer`, {
                    answer: answer,
                    answerer: isName
                });
            }
            navigate(`/counsel/online/detail/${id}`);
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    // 답변 삭제 처리
    const handleDelete = async () => {
        if (window.confirm('답변을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${SERVER_URL}/api/counsel/${id}/answer`);
                navigate(`/counsel/online/detail/${id}`);
            } catch (error) {
                console.error('Error deleting answer:', error);
            }
        }
    };

    return (
        <div className="write-board-container">
            <h1>답변 작성</h1>
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
                    <tr>
                        <th>답변</th>
                        <td>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="답변을 입력해주세요."
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="common-button-container">
                <button onClick={handleSubmit}>
                    {isEdit ? '수정' : '저장'}
                </button>
                {isEdit && <button onClick={handleDelete}>삭제</button>}
                <button onClick={() => navigate(`/counsel/online/detail/${id}`)}>취소</button>
            </div>
        </div>
    );
};

export default CounselAnswerForm;
