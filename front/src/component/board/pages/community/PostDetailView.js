/* (공용) 글 상세 페이지 */
import "../common/css/PostDetailView.css";
import "../common/css/Button.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../api/serverURL";
import useIsAdmin from "../../hooks/useIsAdmin";
import AttachmentView from "./AttachmentView";
import boardTitles from "../common/constants/boardTitles";

const PostDetailView = () => {

    const isAdmin = useIsAdmin();

    const { type, id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/board/${type}/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [id, type]);

    return (
        <div className="common-detail-board-container">
            <h1 className="font-bold">{boardTitles[type]}</h1>
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{post?.title}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{post?.author}</td>
                    </tr>
                    <tr>
                        <th>작성일자</th>
                        <td>{post?.createdDate.replace('T', ' ')}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{post?.content}</td>
                    </tr>
                    <AttachmentView fileList={post?.fileList} />  
                </tbody>
            </table>
            <div className="common-button-container">
                {isAdmin && <button onClick={() => navigate(`/community/${type}/edit/${id}`)}>수정</button>}
                <button onClick={() => navigate(`/community/${type}`)}>목록</button>
            </div>
        </div>
    );
};

export default PostDetailView;
