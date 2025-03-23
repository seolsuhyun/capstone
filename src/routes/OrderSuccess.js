import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate(); // navigate 훅을 사용하여 페이지 이동

  const goHome = () => {
    navigate('/'); // 홈 화면으로 이동
  };

  return (
    <div className="order-success-container">
      <div className="order-success-message">
        <h1>결제가 완료되었습니다!</h1>
        <p>주문이 성공적으로 처리되었습니다. 감사합니다!</p>
        <button className="home-button" onClick={goHome}>홈으로 가기</button>
      </div>
    </div>
  );
};

export default OrderSuccess;
