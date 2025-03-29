import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QAModify.css";

const QAModify = () => {
    const { questionId } = useParams(); // URL에서 questionId 가져오기
    const [boardData, setBoardData] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
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
                setBoardData({ title: response.data.title, content: response.data.content });
            } catch (err) {
                console.error("❌ 게시글 불러오기 오류:", err);
                setError("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchBoardData();
    }, [questionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBoardData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 로딩 시작
        try {
            await axios.put(
                `http://localhost:8080/boards/${questionId}/modify`,
                boardData,
                { withCredentials: true }
            );
            window.alert("게시글이 수정되었습니다.");
            navigate(`/Q&A/content/${questionId}`); // 수정 후 상세 페이지로 이동
        } catch (err) {
            console.error("❌ 수정 오류:", err);
            if (err.response && err.response.status === 401) {
                // 로그인된 사용자가 게시글을 수정할 권한이 없는 경우
                window.alert("본인이 작성한 게시글만 수정할 수 있습니다.");
            } else {
                window.alert("수정에 실패했습니다.");
            }
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    if (loading) {
        return <p>로딩 중...</p>; // 로딩 중일 때
    }

    if (error) {
        return <p>{error}</p>; // 오류 발생 시
    }

    return (
        <div className="qa-modify">
            <h2>게시글 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        name="title"
                        value={boardData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea
                        name="content"
                        value={boardData.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="qa-modify-submit" disabled={loading}>
                    {loading ? "수정 중..." : "수정"}
                </button>
            </form>
        </div>
    );
};

export default QAModify;
