import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QAModify.css";

const QAModify = () => {
    const { questionId } = useParams(); // URL에서 questionId 가져오기
    const [boardData, setBoardData] = useState({ title: "", content: "" });
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
                    withCredentials: true,
                });
                setBoardData({ title: response.data.title, content: response.data.content });
            } catch (err) {
                console.error("❌ 게시글 불러오기 오류:", err);
                setError("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
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
        try {
            await axios.put(
                `http://localhost:8080/boards/${questionId}/modify`,
                boardData,
                { withCredentials: true }
            );
            window.alert("수정되었습니다.");
            navigate(`/Q&A/content/${questionId}`);
        } catch (err) {
            console.error("❌ 수정 오류:", err);
            window.alert("수정에 실패했습니다.");
        }
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
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
                <button type="submit" className="qa-modify-submit">수정</button>
            </form>
        </div>
    );
};

export default QAModify;
