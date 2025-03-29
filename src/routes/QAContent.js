import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLogin } from "../context/LoginContext" // LoginContext에서 훅 가져오기
import "./QAContent.css";

const QAContent = () => {
    const { questionId } = useParams(); // URL에서 questionId 가져오기
    const { userRole, isLoggedIn,userEmail } = useLogin(); // LoginContext에서 로그인 정보와 역할 가져오기
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 상태 추가
    const [newComment, setNewComment] = useState(""); // 새 댓글 상태
    const [isCommentFormVisible, setIsCommentFormVisible] = useState(false); // 댓글 폼 보이기/숨기기
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

    useEffect(() => {
        if (!questionId) {
            console.log("❌ questionId가 없음!");
            return;
        }

        const fetchBoardData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/boards/${questionId}/read`, {
                    withCredentials: true, // 세션 쿠키 포함
                });
                console.log("✅ API 응답 데이터:", response.data);
                setBoardData(response.data);
            } catch (err) {
                console.error("❌ API 호출 오류:", err);
                setError("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/${questionId}/comment`, {
                    withCredentials: true, // 세션 쿠키 포함
                });
                setComments(response.data);
            } catch (err) {
                console.error("❌ 댓글 불러오기 오류:", err);
            }
        };

        fetchBoardData();
        fetchComments();
    }, [questionId]);

    const handleDelete = async () => {
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
        if (isConfirmed) {
            try {
                const response = await axios.patch(`http://localhost:8080/boards/${questionId}/delete`, {}, {
                    withCredentials: true,
                });
                window.alert("삭제되었습니다.");
                window.history.back();
            } catch (err) {
                console.error("❌ 삭제 오류:", err);
                if (err.response && err.response.status === 401) {
                    window.alert("다른 사람의 게시물은 삭제할 수 없습니다.");
                } else {
                    window.alert("삭제에 실패했습니다.");
                }
            }
        }
    };

    const handleEdit = () => {
        navigate(`/Q&A/modify/${questionId}`); // 수정 페이지로 이동
    };

    const handleBackToList = () => {
        navigate("/Q&A"); // Q&A 목록 페이지로 이동
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value); // 댓글 내용 업데이트
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
    
        if (!newComment) {
            window.alert("댓글을 작성해주세요.");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:8080/admin/${questionId}/comments`,
                {
                    comment: newComment, // 실제 댓글 내용
                    member: { email: userEmail } // 로그인한 사용자의 이메일을 member로 전송
                },
                { withCredentials: true }
            );
    
            // 새 댓글을 이전 댓글 목록에 추가
            setComments((prevComments) => [response.data, ...prevComments]);
            setNewComment(""); // 댓글 작성 후 입력란 초기화
            setIsCommentFormVisible(false); // 댓글 폼 숨기기
        } catch (err) {
            console.error("❌ 댓글 작성 오류:", err);
            window.alert("댓글 작성에 실패했습니다.");
        }
    };
    
    const handleCommentDelete = async (commentId) => {
        const isConfirmed = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
        if (isConfirmed) {
            try {
                console.log(`DELETE 요청 보내기: http://localhost:8080/admin/${commentId}/deletecomment`);
                const response = await axios.patch(
                    `http://localhost:8080/admin/${commentId}/deletecomment`,
                    {  }, // 요청 본문에 commentId를 보내기
                    { withCredentials: true } // 세션 쿠키 포함
                );
                console.log("응답:", response);
                setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
                window.alert("댓글이 삭제되었습니다.");
            } catch (err) {
                console.error("❌ 댓글 삭제 오류:", err);
                window.alert("댓글 삭제에 실패했습니다.");
            }
        }
    };
    
    
    
    
    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!boardData) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="qa-content">
            <div className="qa-content-cnt">
                <div className="qa-content-header">
                    <h2>제목 : {boardData.title}</h2>
                    <div className="qa-content-info">
                        <p>작성자: {boardData.memberEmail}</p>
                    </div>
                </div>
                <div className="qa-content-body">
                    <p>{boardData.content}</p>
                </div>
            </div>

            {/* 버튼 그룹으로 나누기 */}
            <div className="qa-content-actions">
                <div className="qa-back-button-container">
                    <button onClick={handleBackToList} className="qa-back-button">
                        목록
                    </button>
                </div>

                <div className="qa-right-buttons-container">
                    <button onClick={handleDelete} className="qa-delete-button">
                        삭제
                    </button>
                    <button onClick={handleEdit} className="qa-edit-button">
                        수정
                    </button>
                </div>
            </div>

            {/* 댓글 작성 버튼 */}
            {isLoggedIn && userRole === 'ROLE_ADMIN' && ( // 로그인한 사용자이며 관리자인 경우
                <div className="qa-comment-actions">
                    <button onClick={() => setIsCommentFormVisible((prev) => !prev)} className="qa-comment-toggle-button">
                        {isCommentFormVisible ? "댓글 작성 취소" : "댓글 달기"}
                    </button>
                </div>
            )}

            {/* 댓글 작성 폼 */}
            {isCommentFormVisible && isLoggedIn && userRole === 'ROLE_ADMIN' && ( // 관리자가 로그인한 경우만 댓글 작성 폼 표시
                <form onSubmit={handleCommentSubmit} className="qa-comment-form">
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="댓글을 작성하세요..."
                        required
                    ></textarea>
                    <button type="submit" className="qa-comment-submit-button">
                        댓글 달기
                    </button>
                </form>
            )}

            {/* 댓글 리스트 */}
       
                <div className="qa-comment-list">
                    <h3>댓글</h3>
                    {comments.length === 0 ? (
                        <p>댓글이 없습니다.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="qa-comment">
                                <p>{comment.member.name}</p>
                                <p>{comment.comment}</p>
                                <button 
                            onClick={() => handleCommentDelete(comment.id)} 
                            className="qa-comment-delete-button"
                        >
                            삭제
                        </button>
                            </div>
                        ))
                    )}
                </div>
            
        </div>
    );
};

export default QAContent;
