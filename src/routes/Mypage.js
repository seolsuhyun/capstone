import React, { useState } from "react";
import "./Mypage.css";

const Mypage = () => {
  const userName = "홍길동";
  const points = 1250;
  const coupons = 5;
  const userGrade = "VIP";
  const product = {
    image: "https://via.placeholder.com/200", // 상품 이미지
    title: "예시상품", // 상품명
    content: "이 상품은 예시 상품입니다.", // 상품 설명
    price: 25000, // 상품 가격
  };
  

  const [quantity, setQuantity] = useState(1);  // 상품 수량 상태

  const increaseQuantity = () => {
    setQuantity(quantity + 1);  // 수량 증가
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);  // 수량 감소 (최소 1)
    }
  };
  const totalPrice = product.price * quantity;
  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>마이페이지</h2>
      </div>
      <div className="user-info">
        <p className="user-name">
          고객님, <span>{userName}</span>님
        </p>
        <p className="user-grade">
          현재 등급: <span className="grade">{userGrade}</span>
        </p>
        <div className="user-details">
          <div className="points">
            <h3>포인트</h3>
            <p>{points} 포인트</p>
          </div>
          <div className="coupons">
            <h3>쿠폰</h3>
            <p>{coupons} 개</p>
          </div>
        </div>
      </div>

      <div className="order-details">
        <h2>주문상세</h2>
        <hr />
        <div className="product">
          <img src="https://via.placeholder.com/150" alt="상품 이미지" className="product-image" />
          <div className="product-info">
             <h2>{product.title}</h2>
            <p>{product.content}</p>
            <h3>가격: {product.price.toLocaleString()} 원</h3>
            <div className="quantity-controls">
              <button onClick={decreaseQuantity} className="quantity-button">-</button>
              <span className="quantity-display">{quantity}</span>
              <button onClick={increaseQuantity} className="quantity-button">+</button>
            </div>
            <h3>총 가격: {totalPrice.toLocaleString()} 원</h3>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Mypage;
