import React, { useState } from "react";
import "./Mypage.css";

const Mypage = () => {
  const userName = "홍길동";
  const points = 1250;
  const coupons = 5;
  const userGrade = "VIP";
  const discount = -20000;
  const shippingCost=3000;
  const product = {
    image: "https://via.placeholder.com/200", // 상품 이미지
    title: "예시상품", // 상품명
    content: "이 상품은 예시 상품입니다.", // 상품 설명
    price: 25000, // 상품 가격
  };


  const [quantity, setQuantity] = useState(1);  // 상품 수량 상태

  const [price, setPrice] = useState(product.price); // 개별 상품 가격 상태 추가

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    setPrice(product.price * (quantity + 1)); // 상품 가격 업데이트
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setPrice(product.price * (quantity - 1)); // 상품 가격 업데이트
    }
  };

  const totalPrice = price+discount+shippingCost; // 총 가격을 업데이트된 상품 가격과 동일하게 설정


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
        <p>{new Date().toLocaleDateString()}</p> {/* 현재 날짜 추가 */}
        <hr />
      </div>
      <div className="product-detil">
        <div>
          <img src="/kit1.jpg" alt="상품 이미지" className="product-image" />
        </div>
        <div className="product-info">
          <h2>{product.title}</h2>
          <p>{product.content}</p>
          {/* 개별 상품 가격 업데이트 */}
          <div className="quantity-controls">
            <h3>가격: {price.toLocaleString()} 원</h3>
            <button onClick={decreaseQuantity} className="quantity-button">-</button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={increaseQuantity} className="quantity-button">+</button>
          </div>
        </div>
      </div>

      <div className="mypage-delivery-info">
  <h2>배송정보</h2>
  <hr />
  <div className="delivery-details">
    <div className="delivery-item">
      <span className="label">받는 분:</span>
      <span className="value">홍길동</span>
    </div>
    <div className="delivery-item">
      <span className="label">휴대폰 번호:</span>
      <span className="value">010-1234-5678</span>
    </div>
    <div className="delivery-item">
      <span className="label">배송지:</span>
      <span className="value">서울특별시 강남구 테헤란로 123</span>
    </div>
  </div>
</div>

<div className="mypage-price-info">
  <h2>주문 금액 정보</h2>
  <div className="mypage-price-details">
    <div className="mypage-price-item">
      <h3>상품 금액</h3>
      <p>{price.toLocaleString()} 원</p>
    </div>
    <span className="mypage-plus-sign">+</span>
    <div className="mypage-price-item">
      <h3>할인 금액</h3>
      <p>{discount.toLocaleString()} 원</p>
    </div>
    <span className="mypage-plus-sign">+</span>
    <div className="mypage-price-item">
      <h3>배송비</h3>
      <p>{shippingCost.toLocaleString()} 원</p>
    </div>
    <span className="mypage-equals-sign">=</span>
    <div className="mypage-total-price">
      <h3>총 결제 금액</h3>
      <p>{totalPrice.toLocaleString()} 원</p>
    </div>
  </div>
</div>



      



    </div>
  );
};

export default Mypage;
