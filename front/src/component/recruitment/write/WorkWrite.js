import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../MainPage/RecruitmentSidebar"; // Sidebar 컴포넌트 임포트
import "../write/WorkWrite.css";

function WorkWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // 파일 목록 상태 추가
  const [attachedFiles, setAttachedFiles] = useState([]); // 첨부 파일 목록 상태 추가
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 목록 상태 추가
  const [headers, setHeaders] = useState({}); // headers 상태 추가

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  const changeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeFile = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChangeAttachedFile = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setAttachedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveAttachedFile = (index) => {
    setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  /* 파일 업로드 */
  const fileUpload = async (boardId) => {
    const fd = new FormData();
    files.forEach((file) => fd.append("file", file));
    attachedFiles.forEach((file) => fd.append("attachedFile", file)); // 첨부 파일 추가

    await axios
      .post(`http://localhost:8989/board/${boardId}/file/upload`, fd, { headers: headers })
      .then((resp) => {
        console.log("[file.js] fileUpload() success :D");
        console.log(resp.data);
        setUploadedFiles(resp.data.uploadedFiles); // 업로드된 파일 목록 저장
        alert("파일 업로드 성공 :D");
      })
      .catch((err) => {
        console.log("[FileData.js] fileUpload() error :<");
        console.log(err);
      });
  };

  /* [POST /bbs]: 게시글 작성 */
  const createBbs = async () => {
    const req = {
      title: title,
      content: content,
    };

    await axios
      .post("http://localhost:8989/board/write", req, { headers: headers })
      .then((resp) => {
        console.log("[WorkWrite.js] createBbs() success :D");
        console.log(resp.data);
        const boardId = resp.data.boardId;
        fileUpload(boardId);
        alert("새로운 게시글을 성공적으로 등록했습니다 :D");
        navigate(`/bbsdetail/${resp.data.boardId}`); // 새롭게 등록한 글 상세로 이동
      })
      .catch((err) => {
        console.log("[WorkWrite.js] createBbs() error :<");
        console.log(err);
      });
  };

  const handleDownloadFile = (fileName) => {
    const url = `http://localhost:8989/board/file/download/${fileName}`;
    window.open(url, "_blank"); // 새 탭에서 파일 다운로드
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm("등록하시겠습니까?");
    if (confirmSubmit) {
      createBbs(); // 확인 시 게시글 등록
    } else {
      // 취소 시 아무 작업도 하지 않음
      alert("등록이 취소되었습니다.");
    }
  };

  useEffect(() => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}`,
    });
  }, []);

  return (
    <div>
      <div className="workWrite-d-flex">
        <Sidebar /> {/* Sidebar 추가 */}
        <div className="workWrite-content-area"> {/* 콘텐츠 영역을 위한 div */}
          <table className="workWrite-table">
            <tbody>
              <tr>
                <th className="workWrite-table-primary">작성자</th>
                <td>
                  <input type="text" className="workWrite-form-control" value={localStorage.getItem("id")} size="50px" readOnly />
                </td>
              </tr>

              <tr>
                <th className="workWrite-table-primary">제목</th>
                <td>
                  <input type="text" className="workWrite-form-control" value={title} onChange={changeTitle} size="50px" />
                </td>
              </tr>

              <tr>
                <th className="workWrite-table-primary">내용</th>
                <td>
                  <textarea className="workWrite-form-control" value={content} onChange={changeContent} rows="10"></textarea>
                </td>
              </tr>
              <tr>
                <th className="workWrite-table-primary">파일</th>
                <td>
                  {files.map((file, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center" }}>
                      <p>
                        <strong>FileName:</strong> {file.name}
                      </p>
                      <button className="workWrite-delete-button" type="button" onClick={() => handleRemoveFile(index)}>
                        x
                      </button>
                    </div>
                  ))}
                  {files.length < 5 && (
                    <div>
                      <input type="file" name="file" onChange={handleChangeFile} multiple="multiple" />
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <th className="workWrite-table-primary">첨부 파일</th>
                <td>
                  {attachedFiles.map((file, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center" }}>
                      <p>
                        <strong>FileName:</strong> {file.name}
                      </p>
                      <button className="workWrite-delete-button" type="button" onClick={() => handleRemoveAttachedFile(index)}>
                        x
                      </button>
                    </div>
                  ))}
                  {attachedFiles.length < 5 && (
                    <div>
                      <input type="file" name="attachedFile" onChange={handleChangeAttachedFile} multiple="multiple" />
                    </div>
                  )}
                </td>
              </tr>
              {/* <tr>
                <th className="workWrite-table-primary">업로드된 파일</th>
                <td>
                  {uploadedFiles.map((fileName, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center" }}>
                      <p>
                        <strong>FileName:</strong> {fileName}
                      </p>
                      <button className="workWrite-download-button" type="button" onClick={() => handleDownloadFile(fileName)}>
                        다운로드
                      </button>
                    </div>
                  ))}
                </td>
              </tr> */}
            </tbody>
          </table>

          <div className="workWrite-button-container">
  <button className="workWrite-btn-outline-secondary" onClick={handleSubmit}>
    <i className="fas fa-pen"></i> 등록하기
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

export default WorkWrite;