import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QAContent.css";

const QAContent = () => {
    const { questionId } = useParams(); // URL에서 questionId 가져오기
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

        fetchBoardData();
    }, [questionId]);

    const handleDelete = async () => {
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
        if (isConfirmed) {
            try {
                await axios.patch(`http://localhost:8080/boards/${questionId}/delete`, {}, {
                    withCredentials: true,
                });
                window.alert("삭제되었습니다.");
                window.history.back();
            } catch (err) {
                console.error("❌ 삭제 오류:", err);
                window.alert("삭제에 실패했습니다.");
            }
        }
    };

    const handleEdit = () => {
        navigate(`/Q&A/modify/${questionId}`); // 수정 페이지로 이동
    };

    if (loading) {
        return <p>로딩 중...</p>; // 로딩 중일 때
    }

    if (error) {
        return <p>{error}</p>; // 오류 발생 시
    }

    if (!boardData) {
        return <p>게시글을 찾을 수 없습니다.</p>; // boardData가 없을 경우
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
            <div className="qa-content-actions">
                <button onClick={handleDelete} className="qa-delete-button">
                    삭제
                </button>
                <button onClick={handleEdit} className="qa-edit-button">
                    수정
                </button>
            </div>
        </div>
    );
};

export default QAContent;
