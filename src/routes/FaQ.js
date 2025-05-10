import React, { useState } from 'react';
import './FaQ.css';
import { useNavigate } from 'react-router-dom'
const FaQ = () => {
  // 클릭된 질문의 상태를 관리하는 state
  const [activeQuestion, setActiveQuestion] = useState(null);
  const navigate = useNavigate();

  const handleInquiryClick = () => {
    navigate('/#1to1'); // 버튼 클릭 시 /1to1 경로로 이동
  };
  // 질문 클릭 시 해당 답변을 토글하는 함수
  const toggleAnswer = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null); // 이미 열려있는 답변을 다시 닫음
    } else {
      setActiveQuestion(index); // 새로운 답변 열기
    }
  };

  return (
    <div className="faq">
      <h1 className="faq-title">자주 묻는 질문</h1>
      <p className="faq-description">
        고객님들이 자주 묻는 질문들을 모아놨습니다.
      </p>

      <div className="faq-cnt">
        <div className="faq-cnt-left">
          <div className="faq-item" onClick={() => toggleAnswer(0)}>
            <div className="faq-question">Q. 주문취소는 어떻게 하나요?</div>
            {activeQuestion === 0 && (
              <div className="faq-answer">
                <p>마이페이지에서 주문 내역을 확인 후 고객 문의 게시판을 통해 주문 취소 문의를 하실 수 있습니다. 주문 취소는 제품 배송 전까지만 가능하며 배송이 시작되면 주문을 취소할 수 없습니다.</p>
              </div>
            )}
          </div>

          <div className="faq-item" onClick={() => toggleAnswer(1)}>
            <div className="faq-question">Q. 배송조회는 어떻게 하나요?</div>
            {activeQuestion === 1 && (
              <div className="faq-answer">
                <p>배송조회는 주문 내역에서 배송 상태를 확인하거나 배송사 홈페이지에서 확인할 수 있습니다.</p>
              </div>
            )}
          </div>

          <div className="faq-item" onClick={() => toggleAnswer(2)}>
            <div className="faq-question">Q. 반품 신청은 어떻게 하나요?</div>
            {activeQuestion === 2 && (
              <div className="faq-answer">
                <p>배송 받은 제품에 문제가 있을 경우 고객 문의 게시판을 통해 반품 문의를 하실 수 있습니다. 환불까지는 최대 1~3일 소요될 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>

        <div className="faq-cnt-right">
          <div className='faq-list'>
            <h2> 자주 찾는 질문</h2>
            <ul>
              <li>
                <p>1. 반품 신청하기</p>
              </li>
              <li>
                <p>2. 주문 취소하기</p>
              </li>
              <li>
                <p>3. 배송 조회방법</p>
              </li>
            </ul>
          </div>
          <div className='faq-customer-call'>
            <h2>고객센터 안내</h2>
            <h3>1588-1234</h3>
            <p>평일 09:00~18:00</p>
            <p>점심 12:00~13:00</p>
            <button onClick={handleInquiryClick}>1:1문의하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaQ;
