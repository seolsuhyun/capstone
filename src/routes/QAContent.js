import { useLocation } from "react-router-dom"; // useLocation 임포트
import "./QAContent.css";

const QAContent = () => {
    // location에서 state를 안전하게 가져옵니다.
    const location = useLocation();
    const { questionData } = location.state || {}; // location.state?.question을 바로 해도 됨

    console.log(questionData); // 전달된 state에서 질문 데이터 확인

    if (!questionData) {
        return <p className="qa-content">잘못된 접근입니다. 질문을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="qa-content">
            <h2>{questionData.title}</h2>
            <p><strong>작성자:</strong> {questionData.name}</p> 
            <p><strong>작성일:</strong> {questionData.date}</p>
            <p><strong>내용:</strong> {questionData.content}</p>
        </div>
    );
};

export default QAContent;
