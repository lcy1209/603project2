import '../../common/css/PostWriteForm.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import { LoginContext } from '../../../../login/security/contexts/LoginContextProvider';

const CounselWriteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const { isName } = useContext(LoginContext);

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            const fetchCounsel = async () => {
                try {
                    const response = await axios.get(`${SERVER_URL}/api/counsel/${id}`);
                    const counsel = response.data;
                    setTitle(counsel.title);
                    setContent(counsel.content);
                    setAuthor(counsel.author);
                    setCreatedDate(counsel.createdDate);
                } catch (error) {
                    console.error('Error fetching counsel:', error);
                }
            };
            fetchCounsel();
        } else {
            setAuthor(isName);
        }
    }, [isEdit, id]);

    // 글 저장/수정 처리
    const handleSubmit = async () => {
        if (!title.trim() && !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        } else if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        } else if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const counselData = {
            title,
            content,
            author,
            createdDate
        };

        try {
            if (isEdit) {
                await axios.put(`${SERVER_URL}/api/counsel/${id}`, counselData);
            } else {
                await axios.post(`${SERVER_URL}/api/counsel`, counselData);
            }
            navigate('/counsel/online');
        } catch (error) {
            console.error('Error saving counsel:', error);
        }
    };

    // 글 삭제 처리
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

    return (
        <div className="write-board-container">
            <h1 className='font-bold'>상담 작성</h1>
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
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
                <button onClick={() => navigate('/counsel/online')}>목록</button>
            </div>
        </div>
    );
};

export default CounselWriteForm;
