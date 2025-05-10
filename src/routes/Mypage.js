import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Mypage.css";
import { useLogin } from "../context/LoginContext";
import AddressPopup from "./AddressPopup";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const { userName, userCode, userId } = useLogin();
  const [addresses, setAddresses] = useState([]);
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const navigate = useNavigate();
  const points = 1250;
  const coupons = 5;
  const userGrade = "VIP";
  const discount = -20000;
  const shippingCost = 3000;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("현재 로그인된 이메일:", userCode);
    axios.get(`http://localhost:8080/orders/${encodeURIComponent(userCode)}`)
      .then((response) => {
        setOrders(response.data);
        console.log(orders);
      })
      .catch((error) => {
        console.error("에러", error);
      });
  }, [userCode]);

  useEffect(() => {
    if (userCode) {
      axios.get("http://localhost:8080/address", {
        withCredentials: true,
      })
        .then(response => {
          setAddresses(response.data); // 모든 주소 저장
        })
        .catch(error => {
          console.error("주소 조회 실패:", error);
        });
    }
  }, [userCode]);

  const getDeliveryStatus = (delivery) => {
    switch (delivery) {
      case 'GO':
        return '배송중';
      case 'DONE':
        return '배송완료';
      case 'RETURN':
        return '반품됨';
      case 'NOT':
      default:
        return '배송전';
    }
  };


  const handleCancelOrder = (orderId, deliveryStatus) => {
    // 배송중 또는 배송완료일 경우 취소 불가
    if (deliveryStatus === 'NOT' || deliveryStatus === 'DONE') {
      navigate("/Q&A");
      return; // 취소 처리 중단
    }
  };

  const handleWithdraw = async () => {
    console.log("userId", userId);
    const confirmed = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8080/${userId}/deleteMember`, {
        method: "POST",
      });

      if (response.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        // 탈퇴 후 로그아웃 처리 또는 메인 페이지로 리디렉션
        window.location.href = "/";
      } else {
        alert("탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };
  const handleDeleteAddress = (addressId) => {
    const confirmed = window.confirm("배송지를 삭제하시겠습니까?");
    if (!confirmed) return;

    axios.delete(`http://localhost:8080/address/${addressId}/delete`)
      .then(() => {
        alert("배송지가 삭제되었습니다.");
        setAddresses(prev => prev.filter(addr => addr.addressId !== addressId));
      })
      .catch(error => {
        console.error("주소 삭제 실패:", error);
        alert("주소 삭제에 실패했습니다.");
      });
  };
  const handleAddressSaved = () => {
    axios.get("http://localhost:8080/address", {
      withCredentials: true,
    })
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => {
        console.error("주소 재조회 실패:", error);
      });
  };

  const handleRegisterAddress = () => {
    setShowAddressPopup(true);

  };


  const calculateTotalPrice = () => {
    let totalProductPrice = 0;
    orders.forEach(order => {
      // 주문 상태가 'CANCEL'이 아닌 경우만 가격을 더한다

      order.orderItemDtoList.forEach(item => {
        totalProductPrice += item.price * item.count;
      });

    });
    return totalProductPrice;
  };

  const totalProductPrice = calculateTotalPrice();
  const totalPrice = totalProductPrice + discount + shippingCost;
  const getImageUrl = (imagePath) => {
    return imagePath.startsWith("/images/item/")
      ? `http://localhost:8080${imagePath}`
      : imagePath;
  };
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
        <button className="withdraw-button" onClick={handleWithdraw}>
          회원 탈퇴
        </button>
      </div>
      <div className="order-details">
        <h2>주문상세</h2>
        <hr />
        <div className="mypage-order-items">
          {orders.length > 0 ? (
            orders.map((order, index) => (

              (
                <div key={index} className="mypage-order-item">
                  <div className="mypage-order-item-details">
                    <div className="mypage-order-header">
                      <p>주문일: {order.orderDate}</p>

                      <button
                        className="cancel-button"
                        onClick={() => handleCancelOrder(order.orderId, order.delivery)}
                        disabled={
                          order.delivery === 'GO' || order.delivery === 'RETURN'
                        }
                      >
                        {order.delivery === 'DONE' || order.delivery === 'RETURN'
                          ? '반품 문의'
                          : '주문 취소 문의'}
                      </button>

                    </div>
                    {order.orderItemDtoList.map((item, itemIndex) => (
                      <div key={itemIndex} className="mypage-order-item-detail">
                        <img src={getImageUrl(item.image)} alt={item.name} className="mypage-product-image" />
                        <div className="mypage-product-info">
                          <h4>{item.name}</h4>
                          <p>{item.productContent}</p>
                          <div className="mypage-price-quantity">
                            <p className="mypage-price">가격: {item.price} 원</p>
                            <p className="mypage-quantity">수량: {item.count}</p>
                          </div>
                          <p>주문 상태 : {getDeliveryStatus(order.delivery)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))
          ) : (
            <p>주문 내역이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="mypage-delivery-info">
        <div className="delivery-info-header">
          <h2>배송정보</h2>
          <button className="register-address-button" onClick={handleRegisterAddress}>
            주소 추가
          </button>
        </div>
        <hr />
        <div className="delivery-item"><span className="label">받는 분:</span> <span className="value">{userName}</span></div>
        <div className="delivery-item"><span className="label">휴대폰 번호:</span> <span className="value">010-1234-5678</span></div>
        {addresses.length > 0 ? (
          <div className="delivery-list">
            {addresses.map((addr) => (
              <div key={addr.addressId} className="delivery-item">
                <span className="label">{addr.addressId}번 배송지:</span>{" "}
                <span className="value">
                  {addr.address} {addr.addressDetail}
                </span>
                <button
                  className="delete-address-button"
                  onClick={() => handleDeleteAddress(addr.addressId)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>등록된 주소가 없습니다.</p>
        )}
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
      {showAddressPopup && (
        <AddressPopup
          onClose={() => setShowAddressPopup(false)}
          onSaved={handleAddressSaved}
        />
      )}
    </div>
  );
};

export default Mypage;