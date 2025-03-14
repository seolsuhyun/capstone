import React from "react";
import { useLocation } from "react-router-dom";
import "./Order.css";

function Order() {
  const location = useLocation(); // 전달된 상태를 가져옵니다.
  const { product } = location.state || {}; // state가 없다면 빈 객체로 처리

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  return (
    <div className="order">
      <h1>주문하기</h1>
      <h2>주문상품</h2>
      <div className="order_product-container">
        <div className="order_product_nav">
        <hr/>
          <ul>
            <li>
              <label>상품명</label>
            </li>
            <li>
              <label>가격</label>
            </li>
            <li>
              <label>수량</label>
            </li> 
             <li>
              <label>합계</label>
              </li>
          </ul>
          <hr/>
        </div>
        <div className="order_product_item">
        <img
          src={product.image}
          alt={product.title}
          style={{ width: '100px', height: '100px', borderRadius: '10px', objectFit: 'comtain' }}
        />
        <h2>{product.title}</h2>
        <p>가격: {product.price.toLocaleString()} 원</p>
        </div>
      </div>
    </div>
  );
}

export default Order;
