import axios from "axios";
import React, { useState,  } from "react";  //오류 발생 시 추가 useContext
import { useParams } from "react-router-dom";


/* 댓글 컴포넌트 */
function Comment(props) {


  const page = props.page;
  const comment = props.obj;
  const commentId = comment.commentId; // 댓글 ID
  const { boardId } = useParams(); // URL에서 boardId 가져오기

  const [show, setShow] = useState(false); // 수정 화면 표시 여부
  const [content, setContent] = useState(comment.content); // 댓글 내용
  const changeContent = (event) => setContent(event.target.value);

  /* 댓글 수정 */
  const updateComment = async () => {
    const req = { content };

    try {
      const resp = await axios.patch(
        `http://localhost:8989/board/${boardId}/comment/update/${commentId}`,
        req,
        {  }
      );

      console.log("[Comment.js] updateComment() success :D", resp.data);
      alert("댓글을 성공적으로 수정했습니다!");
      props.getCommentList(page); // 댓글 목록 업데이트
      setShow(false); // 수정 창 닫기
    } catch (err) {
      console.log("[Comment.js] updateComment() error :<", err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  /* 댓글 삭제 */
  const deleteComment = async () => {
    try {
      const resp = await axios.delete(
        `http://localhost:8989/board/${boardId}/comment/delete/${commentId}`,
        {  }
      );

      console.log("[Comment.js] deleteComment() success :D", resp.data);
      alert("댓글을 성공적으로 삭제했습니다!");
      props.getCommentList(page); // 댓글 목록 업데이트
    } catch (err) {
      console.log("[Comment.js] deleteComment() error :<", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  /* 수정 창 토글 */
  const updateToggle = () => setShow((prevShow) => !prevShow);

  return (
    <>
      {/* 댓글 상단: 작성자 정보 */}
      <div className="my-1 d-flex justify-content-center">
        <div className="col-1">
          <img
            src="/images/profile-placeholder.png"
            alt="프로필 이미지"
            className="profile-img"
          />
        </div>
        <div className="col-5">
          <div className="row">
            <span className="comment-id">{comment.commentWriterName}</span>
          </div>
          <div className="row">
            <span>{comment.createdDate}</span>
          </div>
        </div>

        <div className="col-4 d-flex justify-content-end">
          {/* 본인이 작성한 댓글만 수정/삭제 버튼 표시 */}
          {localStorage.getItem("id") === comment.commentWriterName && (
            <>
              <button
                className="btn btn-outline-secondary"
                onClick={updateToggle}
              >
                <i className="fas fa-edit"></i> 수정
              </button>
              &nbsp;
              <button
                className="btn btn-outline-danger"
                onClick={deleteComment}
              >
                <i className="fas fa-trash-alt"></i> 삭제
              </button>
            </>
          )}
        </div>
      </div>

      {/* 댓글 내용 */}
      {show ? (
        <>
          <div className="my-3 d-flex justify-content-center">
            <textarea
              className="col-10"
              rows="5"
              value={content}
              onChange={changeContent}
            ></textarea>
          </div>
          <div className="my-1 d-flex justify-content-center">
            <button className="btn btn-dark" onClick={updateComment}>
              <i className="fas fa-edit"></i> 수정 완료
            </button>
          </div>
        </>
      ) : (
        <div className="my-3 d-flex justify-content-center">
          <div className="col-10 comment">{content}</div>
        </div>
      )}
    </>
  );
}

export default Comment;
