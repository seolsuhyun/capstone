import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Order.css";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from 'axios';
function Order() {
  const location = useLocation(); // 전달된 상태를 가져옵니다.
  const { product } = location.state || {}; // state가 없다면 빈 객체로 처리
  const open = useDaumPostcodePopup();
  const [paymentMethod, setPaymentMethod] = useState('신용카드');
  const [bankName, setBankName] = useState(''); // 입금은행 상태
  const [depositor, setDepositor] = useState('');
  const [depositDate, setDepositDate] = useState('');
  const [zonecode, setZonecode] = useState('');
  const [roadAddress, setLoadAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [deliveryMemo, setDeliveryMemo] = useState(''); // 배송 메모 상태
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [couponDiscount, setCouponDiscount] = useState(0); // 쿠폰 할인 금액
  const [pointsUsage, setPointsUsage] = useState(0); // 포인트 사용 금액
  const [shippingCost, setShippingCost] = useState(3500); //기본배송비
  const [isPersonalInfoAgreed, setIsPersonalInfoAgreed] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPaymentAgreed, setIsPaymentAgreed] = useState(false);
  const [count, setcount] = useState(1);

  const API_URL = "http://localhost:8080";
  const navigate = useNavigate();

  const createOrder = async () => {


    try {
      await axios.post(`${API_URL}/order`, { id: product.id, count }, {
        withCredentials: true,
      });
      alert("Order Created!");

      // 결제 완료 후 OrderSuccess 페이지로 이동
      navigate('/order/ordersuccess');  // 이 부분에서 페이지 이동
    } catch (error) {
      console.error("Error creating order", error);
      alert("주문 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };


  const calculateTotalPrice = () => {
    const total = totalPrice - couponDiscount - pointsUsage + shippingCost;
    return total < 0 ? 0 : total; // 0 미만으로는 안되도록 처리
  };
  // 날짜계산
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  const maxDateString = maxDate.toISOString().split('T')[0];


  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';

      setZonecode(data.zonecode);  // 우편번호
      setLoadAddress(fullAddress); // 도로명 주소
    }
  };

  const handleClick = () => {
    open(
      { onComplete: handleComplete },
    );
  };

  const handleMemoChange = (e) => {
    setDeliveryMemo(e.target.value);  // 배송 메모를 입력 받을 때마다 상태 업데이트
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);  // 드롭다운에서 선택된 값 업데이트
  };

  const allAgreed = isPersonalInfoAgreed && isTermsAgreed && isPaymentAgreed; // 체크박스 확인함수

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }


  // 수량 증가 함수
  const increasecount = () => {
    setcount(prevcount => prevcount + 1);
  };

  // 수량 감소 함수 (0보다 작지 않도록)
  const decreasecount = () => {
    if (count > 1) {
      setcount(prevcount => prevcount - 1);
    }
  };
  const totalPrice = product.price * count;

  return (
    <div className="order">
      <h1>결제하기</h1>

      <div className="order_product_container">

        <div className="cnt-left">
          <div className='order_product_info'>
            <h2>주문상품정보</h2>
            <div className="order_product_item">
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "10px",
                  objectFit: "contain",
                }}
              />
              <div className="order_product_name_price">
                <h2>{product.name}</h2>
                <p>{product.content}</p>
                <div className="order_product_count_price">
               
                  <div className="count-price-container">
                    <h3 style={{ marginRight: "15px" }}>금액: {totalPrice.toLocaleString()} 원</h3>
                    <div className="count-controls">
                      <button
                        className="count-button decrease"
                        onClick={decreasecount}
                      >
                        -
                      </button>
                      <span className="count-number">{count}</span>
                      <button
                        className="count-button increase"
                        onClick={increasecount}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div className="orderer_info">
            <h2>주문자 정보</h2>
            <p>주문자 이름</p>
            <p>010-1234-1234</p>
            <p>user@naver.com</p>
          </div>

          <div className="delivery_info">
            <h2>배송 정보</h2>
            <div className="input-group">
              <label htmlFor="zone-code">우편번호</label>
              <div className="input-container">
                <input
                  id="zone-code"
                  placeholder="우편번호"
                  value={zonecode}
                  readOnly
                />
                <button type="button" onClick={handleClick} className="postcode-btn">
                  우편번호 찾기
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="road-address">도로명 주소</label>
              <input
                id="road-address"
                placeholder="도로명주소"
                value={roadAddress}
                readOnly
              />
            </div>

            <div className="input-group">
              <label htmlFor="detail-address">상세 주소</label>
              <input
                id="detail-address"
                placeholder="상세주소"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
              />
            </div>


            <div className="input-group">
              <label htmlFor="delivery-option">배송 옵션 선택</label>
              <select
                id="delivery-option"
                value={deliveryOption}
                onChange={handleDeliveryOptionChange}
                className="dropdown"
              >
                <option value="standard">일반 배송</option>
                <option value="express">익스프레스 배송</option>
                <option value="overnight">하룻밤 배송</option>
              </select>
            </div>


            <div className="input-group">
              <label htmlFor="delivery-memo">배송 메모</label>
              <textarea
                id="delivery-memo"
                placeholder="배송 메모를 입력하세요"
                value={deliveryMemo}
                onChange={handleMemoChange}
                rows="4"
              />
            </div>
          </div>

          <div className="coupon">
            <h2>쿠폰/포인트</h2>

            <div className="coupon-field">
              <label htmlFor="coupon-code">쿠폰</label>
              <div className="coupon-input-group">
                <input type="text" id="coupon-code" placeholder="쿠폰 코드 입력" />
                <button className="apply-btn">쿠폰 적용</button>
              </div>
            </div>

            <div className="coupon-field">
              <label htmlFor="coupon-number">쿠폰 번호</label>
              <div className="coupon-input-group">
                <input type="text" id="coupon-number" placeholder="쿠폰 번호 입력" />
                <button className="verify-btn">번호 확인</button>
              </div>
            </div>

            <div className="coupon-field">
              <label htmlFor="points">포인트</label>
              <div className="coupon-input-group">
                <input type="number" id="points" placeholder="포인트 입력" />
                <button className="use-full-btn">전액 사용</button>
              </div>
            </div>
          </div>
        </div>
        <div className="cnt-right">
          <div className="order-price">
            <h2>최종결제금액</h2>

            <div className="price-details">
              <div className="price-item">
                <label>상품가격</label>
                <p>{totalPrice.toLocaleString()}  원</p>
              </div>
              <div className="price-item">
                <label>쿠폰할인</label>
                <p>{couponDiscount > 0 ? couponDiscount.toLocaleString() : "0"} 원</p>
              </div>
              <div className="price-item">
                <label>포인트사용</label>
                <p>{pointsUsage > 0 ? pointsUsage.toLocaleString() : "0"} 원</p>
              </div>
              <div className="price-item">
                <label>배송비</label>
                <p>{shippingCost.toLocaleString()} 원</p>
              </div>
            </div>

            <div className="final-price">
              <h3>최종결제금액</h3>
              <p>{calculateTotalPrice().toLocaleString()} 원</p>
            </div>
          </div>


          <div className="pay-info">
            <h2>결제 방법 선택</h2>
            <table className="payment-table">
              <tbody>
                <tr>
                  <td
                    onClick={() => handlePaymentSelection('credit-card')}
                    className={`payment-option-cell ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                  >
                    <label className="payment-option">신용카드</label>
                  </td>
                  <td
                    onClick={() => handlePaymentSelection('kakao-pay')}
                    className={`payment-option-cell ${paymentMethod === 'kakao-pay' ? 'selected' : ''}`}
                  >
                    <label className="payment-option">카카오페이</label>
                  </td>
                </tr>
                <tr>
                  <td
                    onClick={() => handlePaymentSelection('bank-transfer')}
                    className={`payment-option-cell ${paymentMethod === 'bank-transfer' ? 'selected' : ''}`}
                  >
                    <label className="payment-option">무통장 입금</label>
                  </td>
                  <td
                    onClick={() => handlePaymentSelection('virtual-account')}
                    className={`payment-option-cell ${paymentMethod === 'virtual-account' ? 'selected' : ''}`}
                  >
                    <label className="payment-option">가상계좌</label>
                  </td>
                </tr>
                <tr>
                  <td

                    onClick={() => handlePaymentSelection('mobile-payment')}
                    className={`payment-option-cell ${paymentMethod === 'mobile-payment' ? 'selected' : ''}`}
                  >
                    <label className="payment-option">핸드폰 결제</label>
                  </td>
                  <td className="empty-cell"></td>
                </tr>


              </tbody>
            </table>
            <p><span className="highlight">'{paymentMethod ? paymentMethod : '없음'}'</span>를 선택하셨습니다. 아래 주문하기를 눌러 결제를 이어가주세요..</p>
            {paymentMethod === 'bank-transfer' && (
              <div className="bank-details">
                <div>
                  <label htmlFor="bank-name">입금은행</label>
                  <select
                    id="bank-name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option value="">입금은행선택</option>
                    <option value="국민은행">국민은행 / 123412341234</option>
                    <option value="하나은행">하나은행 / 123412341234</option>
                    <option value="신한은행">신한은행 / 123412341234</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="depositor">입금자</label>
                  <input
                    id="depositor"
                    type="text"
                    placeholder="입금자 이름을 입력하세요"
                    value={depositor}
                    onChange={(e) => setDepositor(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="deposit-date">입금 예정 날짜</label>
                  <input
                    id="deposit-date"
                    type="date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    min={today.toISOString().split('T')[0]} // 오늘 날짜 이후로만 선택 가능
                    max={maxDateString} // 오늘로부터 7일 이후 날짜까지 선택 가능
                  />
                </div>
              </div>
            )}
          </div>
          <div className="payment-cnt">
            <h2>결제 전 동의사항</h2>

            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={isPersonalInfoAgreed}
                  onChange={() => setIsPersonalInfoAgreed(!isPersonalInfoAgreed)}
                />
                개인정보 처리방침에 동의합니다.
              </label>
            </div>

            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={isTermsAgreed}
                  onChange={() => setIsTermsAgreed(!isTermsAgreed)}
                />
                이용약관에 동의합니다.
              </label>
            </div>

            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={isPaymentAgreed}
                  onChange={() => setIsPaymentAgreed(!isPaymentAgreed)}
                />
                결제 동의합니다.
              </label>
            </div>


            <div>
              <button
                className="pay-button"
                disabled={!allAgreed}
                onClick={createOrder}
              >
                결제하기
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Order;
