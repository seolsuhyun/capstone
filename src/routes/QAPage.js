import "./QAPage.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QAPage = () => {
    const questionsPerPage = 5; // 한 페이지에 보여줄 질문 수

    const [questions, setQuestions] = useState([]); // 서버에서 가져온 질문 데이터를 저장
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [loading, setLoading] = useState(false); // 데이터 로딩 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
    const [filteredQuestions, setFilteredQuestions] = useState([]); // 필터된 질문 상태

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

                // 서버에서 받은 데이터는 작성 순서대로 받아온다고 가정하고
                // id를 기준으로 내림차순으로 정렬
                const sortedQuestions = response.data.sort((a, b) => b.id - a.id); // id 기준 내림차순 정렬

                setQuestions(sortedQuestions);
                setTotalPages(Math.ceil(sortedQuestions.length / questionsPerPage)); // 페이지 수 계산
                setFilteredQuestions(sortedQuestions); // 모든 질문을 필터된 상태로 설정
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // 검색어 변경
    };

    const handleSearchClick = () => {
        if (searchTerm === "") {
            setFilteredQuestions(questions); // 검색어가 비었으면 모든 질문을 다시 보여줌
        } else {
            const filtered = questions.filter(q =>
                q.title.toLowerCase().includes(searchTerm.toLowerCase()) // 제목에 검색어 포함하는 질문 필터링
            );
            setFilteredQuestions(filtered); // 필터된 질문만 상태에 저장
        }
    };

    const currentQuestions = filteredQuestions.slice(
        (currentPage - 1) * questionsPerPage,
        currentPage * questionsPerPage
    );

    const handleQuestionClick = (questionId) => {
        navigate(`/Q&A/content/${questionId}`, { state: { questionId } });
    };

    const handleWriteClick = () => {
        navigate("/Q&A/Boardwrite"); // 글쓰기 페이지로 이동
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
            <div className="qa-search">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="qa-search-input"
                />
                <button className="qa-search-button" onClick={handleSearchClick}>
                    검색
                </button>
            </div>
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
                            <tr key={q.id} onClick={() => handleQuestionClick(q.id)}>
                                <td>{q.id}</td>
                                <td className="qa-title-cell">{q.title}</td>
                                <td>{q.name}</td>
                                <td>{q.date.split("T")[0]}</td>
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
            <div className="qa-search-write">
                <button onClick={handleWriteClick} className="qa-write-button">
                    글쓰기
                </button>
            </div>
        </div>
    );
};

export default React.memo(QAPage);
