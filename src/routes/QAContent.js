import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // useLocation 임포트
import "./QAContent.css";

const QAContent = () => {
    // location에서 state를 안전하게 가져옵니다.
    const location = useLocation();
    const { question } = location.state || {}; // location.state?.question을 바로 해도 됨

    console.log(question); // 전달된 state에서 질문 데이터 확인

    if (!question) {
        return <p>잘못된 접근입니다. 질문을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="qa-content">
            <h2>{question.title}</h2>
            <p><strong>작성자:</strong> {question.name}</p> {/* 이름이 올바른 필드인지 확인 */}
            <p><strong>작성일:</strong> {question.date}</p>
            <p><strong>내용:</strong> {question.content}</p>
        </div>
    );
};

export default QAContent;
