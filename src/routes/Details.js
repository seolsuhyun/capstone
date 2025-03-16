// Detail.js
import React from "react";
import { useParams,useNavigate } from "react-router-dom"; // URL에서 파라미터 추출, 페이지 이동
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
    <div className="product">
    <div className="product-container">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <h1>{product.title}</h1>
        <h2>{product.price}원</h2>
        <p>{product.content}</p>
        <div className="button-container">
          <button className="add-to-cart">장바구니 추가</button>
          <button className="buy-now" onClick={handleOrderClick}>구매하기</button>
        </div>

      </div>
    </div>

    <div className="product-details">
      <h2>상품 상세 정보</h2>
      <p> 
        여기에 상품 상세 설명이 들어감. <br />
        다양한 제품의 특징, 재질, 크기, 세탁 방법 등의 정보를 확인할 수 있게 추가할 예정.
      </p>
    </div>
  </div>
  );
}

export default Detail;
