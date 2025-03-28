import "./QAPage.css";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import axios from "axios";

const QAPage = () => {
    const questionsPerPage = 5; // 한 페이지에 보여줄 질문 수

    const [questions, setQuestions] = useState([]); // 서버에서 가져온 질문 데이터를 저장
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [loading, setLoading] = useState(false); // 데이터 로딩 상태

    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

    // 페이지가 변경될 때마다 데이터를 새로 가져옵니다.
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/boards/mainboard", {
                    params: {
                        page: currentPage,
                        size: questionsPerPage,
                    },
                });

                setQuestions(response.data);
                setTotalPages(Math.ceil(response.data.length / questionsPerPage));
                console.log(response.data);
            } catch (error) {
                console.error("질문 데이터를 가져오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // 페이지 변경
    };

    const currentQuestions = useMemo(() => {
        const indexOfLastQuestion = currentPage * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        return questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    }, [currentPage, questions]);

    const handleQuestionClick = (questionId,questionData) => {
       
        navigate(`/Q&A/content/${questionId}`,{state: questionData});
        console.log('Navigating to question:', questionData); // 클릭한 질문 ID를 URL에 전달하여 상세 페이지로 이동
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return () => clearTimeout(timer);
    }, [currentPage]);

    return (
        <div className="QAPage">
            <h2 className="qa-title">Q&A 게시판</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <table className="qa-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>작성시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQuestions.map((q) => (
                            <tr key={q.id} onClick={() => handleQuestionClick(q.id,q)}>
                                <td>{q.id}</td>
                                <td className="qa-title-cell">{q.title}</td>
                                <td>{q.name}</td>
                                <td>{q.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                <p>{currentPage} / {totalPages}</p>
                <button
                    onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                >
                    ◁
                </button>
                <button
                    onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                >
                    ▷
                </button>
            </div>
        </div>
    );
};

export default React.memo(QAPage);
