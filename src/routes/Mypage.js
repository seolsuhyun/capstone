import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Mypage.css";
import { useLogin } from "../context/LoginContext";

const Mypage = () => {
  const { userName, userEmail } = useLogin();

  const points = 1250;
  const coupons = 5;
  const userGrade = "VIP";
  const discount = -20000;
  const shippingCost = 3000;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("현재 로그인된 이메일:", userEmail);
    axios.get(`http://localhost:8080/orders/${encodeURIComponent(userEmail)}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("에러", error);
      });
  }, [userEmail]);

  const handleCancelOrder = (orderId) => {
    axios.patch(`http://localhost:8080/order/${orderId}/cancel`)
      .then(() => {
        alert("주문이 취소되었습니다.");
        setOrders(orders.filter(order => order.id !== orderId));
      })
      .catch(error => {
        alert("주문 취소에 실패했습니다.");
        console.error("주문 취소 에러", error);
      });
  };

  const calculateTotalPrice = () => {
    let totalProductPrice = 0;
    orders.forEach(order => {
      order.orderItemDtoList.forEach(item => {
        totalProductPrice += item.price * item.count;
      });
    });
    return totalProductPrice;
  };

  const totalProductPrice = calculateTotalPrice();
  const totalPrice = totalProductPrice + discount + shippingCost;

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>마이페이지</h2>
      </div>
      <div className="user-info">
        <p className="user-name">고객님, <span>{userName}</span>님</p>
        <p className="user-grade">현재 등급: <span className="grade">{userGrade}</span></p>
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
        <div className="mypage-order-items">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="mypage-order-item">
                <div className="mypage-order-item-details">
                  <p>주문일: {order.orderDate}</p>
                  {order.orderItemDtoList.map((item, itemIndex) => (
                    <div key={itemIndex} className="mypage-order-item-detail">
                      <img src={item.image} alt={item.name} className="mypage-product-image" />
                      <div className="mypage-product-info">
                        <h4>{item.name}</h4>
                        <p>{item.productContent}</p>
                        <div className="mypage-price-quantity">
                          <p className="mypage-price">가격: {item.price} 원</p>
                          <p className="mypage-quantity">수량: {item.count}</p>
                        </div>
                        <p>주문 상태 : {order.status}</p>
                        <button className="cancel-button" onClick={() => handleCancelOrder(order.orderId)}>주문 취소</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>주문 내역이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="mypage-delivery-info">
        <h2>배송정보</h2>
        <hr />
        <div className="delivery-details">
          <div className="delivery-item"><span className="label">받는 분:</span> <span className="value">홍길동</span></div>
          <div className="delivery-item"><span className="label">휴대폰 번호:</span> <span className="value">010-1234-5678</span></div>
          <div className="delivery-item"><span className="label">배송지:</span> <span className="value">서울특별시 강남구 테헤란로 123</span></div>
        </div>
      </div>
      <div className="mypage-price-info">
        <h2>주문 금액 정보</h2>
        <div className="mypage-price-details">
          <div className="mypage-price-item"><h3>상품 금액</h3><p>{totalProductPrice.toLocaleString()} 원</p></div>
          <span className="mypage-plus-sign">+</span>
          <div className="mypage-price-item"><h3>할인 금액</h3><p>{discount.toLocaleString()} 원</p></div>
          <span className="mypage-plus-sign">+</span>
          <div className="mypage-price-item"><h3>배송비</h3><p>{shippingCost.toLocaleString()} 원</p></div>
          <span className="mypage-equals-sign">=</span>
          <div className="mypage-total-price"><h3>총 결제 금액</h3><p>{totalPrice.toLocaleString()} 원</p></div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
