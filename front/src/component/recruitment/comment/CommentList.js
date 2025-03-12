import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Comment from "./Comment.js";
import "../../recruitment/css/commentList.css"; // 스타일 파일 import

function CommentList(props) {
	const boardId = props.boardId;

	// Paging
	const [page, setPage] = useState(1);
	const [, setPageSize] = useState(5);  //오류 발생 시 다시 추가 pageSize
	const [totalPages, setTotalPages] = useState(5);
	const [, setTotalCnt] = useState(0); // 오류 발생 시 다시 추가 totalCnt
	const [commentList, setCommentList] = useState([]);

	// comment에서 참조
	const getCommentListRef = useRef(null);

	const getCommentList = useCallback(async (page) => {
		await axios.get(`http://localhost:8989/board/${boardId}/comment/list`, { params: { "page": page - 1 } })
			.then((resp) => {
				console.log("[BbsComment.js] getCommentList() success :D");
				console.log(resp.data);

				setPageSize(resp.data.pageSize);
				setTotalPages(resp.data.totalPages);
				setTotalCnt(resp.data.totalElements);
				setCommentList(resp.data.content);
			}).catch((err) => {
				console.log("[BbsComment.js] getCommentList() error :<");
				console.log(err);
			});
	}, [boardId]); // boardId가 변경될 때만 다시 생성

	useEffect(() => {
		getCommentListRef.current = getCommentList;
		getCommentList(1);
	}, [getCommentList]); // getCommentList를 의존성 배열에 추가

	const changePage = (newPage) => {
		setPage(newPage);
		getCommentList(newPage);
		getCommentListRef.current(newPage);
	};

	const renderPagination = () => {
		const pageNumbers = [];
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(
				<button
					key={i}
					onClick={() => changePage(i)}
					className={`page-button ${page === i ? 'active' : ''}`}
				>
					{i}
				</button>
			);
		}
		return <div className="pagination">{pageNumbers}</div>;
	};

	return (
		<>
			<div className="my-1 d-flex justify-content-center">
			</div>

			{renderPagination()}

			{
				commentList.map((comment, idx) => (
					<div className="my-5" key={idx}>
						<Comment obj={comment} key={idx} page={page} getCommentList={getCommentListRef.current} />
					</div>
				))
			}
		</>
	);
}

export default CommentList;
