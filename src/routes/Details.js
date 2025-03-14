// Detail.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // URL에서 파라미터 추출, 페이지 이동
import data from "./data";
import "./Details.css";

function Detail() {
  const { id } = useParams(); // URL에서 id를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const product = data.find((item) => item.id === parseInt(id)); // id에 맞는 상품을 찾습니다.

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  const handleOrderClick = () => {
    // 상품 정보를 state로 주문 페이지로 넘기기
    navigate("/order", { state: { product } });
  };

  return (
    <div className="details">
      <h1>{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '400px', height: 'auto', borderRadius: '10px' }}
      />
      <p>{product.content}</p>
      <p>가격: {product.price.toLocaleString()} 원</p>

      {/* 주문하기 버튼 */}
      <button onClick={handleOrderClick} className="order-button">
        주문하기
      </button>
    </div>
  );
}

export default Detail;
