import "./QAPage.css";
import React, { useEffect, useState, useMemo } from "react";

const QAPage = () => {
    const questions = useMemo(() => [
        { no: 8, title: "배송 언제 되나요?", name: "노채연", date: "2025-03-07" },
        { no: 7, title: "🔒 비밀글입니다.", name: "익명", date: "2025-03-05" },
        { no: 6, title: "🔒 비밀글입니다.", name: "익명", date: "2025-02-28" },
        { no: 5, title: "🔒 비밀글입니다.", name: "익명", date: "2025-02-15" },
        { no: 4, title: "고구마 튀김 재입고 가능성 있나요?", name: "이현태", date: "2025-01-31" },
        { no: 3, title: "🔒 비밀글입니다.", name: "익명", date: "2025-01-25" },
        { no: 2, title: "무통장 입금 결제가 안돼요ㅠㅠ", name: "설수현", date: "2025-01-11" },
        { no: 1, title: "이 상품 언제 입고되나요?", name: "박규석", date: "2025-01-01" },
    ], []);

    const questionsPerPage = 5; //한 페이지에 보여줄 질문 수
    const totalPages = Math.ceil(questions.length / questionsPerPage); //총 페이지 수

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentQuestions = useMemo(() => {
        const indexOfLastQuestion = currentPage * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        return questions.slice(indexOfFirstQuestion, indexOfLastQuestion); //현재 페이지에 해당하는 질문만 추출
    }, [currentPage, questions]);

    //스크롤 상단으로 이동
    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return () => clearTimeout(timer);
    }, [currentPage]);

    return (
        <div className="QAPage">
            <h2 className="qa-title">Q&A 게시판</h2>
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
                        <tr key={q.no}>
                            <td>{q.no}</td>
                            <td className="qa-title-cell">{q.title}</td>
                            <td>{q.name}</td>
                            <td>{q.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
