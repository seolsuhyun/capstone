import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Order.css";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useLogin } from "../context/LoginContext";
import axios from 'axios';
function Order() {
  const location = useLocation();
  const { product } = location.state || {};  // 상태가 없다면 빈 객체로 처리

  // 주소 검색 팝업을 사용할 수 있게 하는 hook
  const open = useDaumPostcodePopup();

  // 주문 상태와 정보를 담을 useState 선언
  const [paymentMethod, setPaymentMethod] = useState('card');  // 결제 방법 기본값
  const [payPg, setPayPg] = useState('kicc');
  const [paymentMethodName, setPaymentMethodName] = useState('신용카드');
  const [bankName, setBankName] = useState('');  // 입금은행
  const [depositor, setDepositor] = useState('');  // 입금자 이름
  const [depositDate, setDepositDate] = useState('');  // 입금 예정일
  const [zonecode, setZonecode] = useState('');  // 우편번호
  const [roadAddress, setRoadAddress] = useState('');  // 도로명 주소
  const [detailAddress, setDetailAddress] = useState('');  // 상세 주소
  const [deliveryMemo, setDeliveryMemo] = useState('');  // 배송 메모
  const [deliveryOption, setDeliveryOption] = useState('standard');  // 배송 옵션
  const [couponDiscount, setCouponDiscount] = useState(1000);  // 쿠폰 할인 금액
  const [couponCode, setCouponCode] = useState('');
  const [pointsUsage, setPointsUsage] = useState(0);  // 사용 포인트
  const [shippingCost, setShippingCost] = useState(3500);  // 기본 배송비
  const [isPersonalInfoAgreed, setIsPersonalInfoAgreed] = useState(false);  // 개인정보 처리 방침 동의 여부
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);  // 이용 약관 동의 여부
  const [isPaymentAgreed, setIsPaymentAgreed] = useState(false);  // 결제 동의 여부
  const [count, setcount] = useState(1);  // 상품 수량
  const { userName, userEmail } = useLogin();  // 로그인한 사용자 정보
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  

  // 주소 유효성 체크
  const [errors, setErrors] = useState({
    zonecode: false,
    roadAddress: false,
    detailAddress: false,
  });  // 주소 입력 오류 상태
  const [couponErrors, setCouponErrors] = useState({
    couponCode: false,
  });

 useEffect(() => {
        fetchUserAddress();
    }, []);
  const API_URL = "http://localhost:8080";  // API 기본 URL
  const navigate = useNavigate();  // 페이지 이동을 위한 hook

  // 주문 생성 함수 (주소 검증 후 서버에 요청)
  const createOrder = async () => {
    if (!validateAddress()) return;  // 주소 검증 실패 시 종료
   
    if (!hasSavedAddress) { // 👉 주소가 없는 경우에만 confirm 띄우기
      const wantToSave = window.confirm("다음에도 이 주소를 사용하시겠습니까?");
      if (wantToSave) {
          await saveAddressToServer();
      }
  }
    try {
      await axios.post(`${API_URL}/order`, { id: product.id, count }, {
        withCredentials: true,  // 쿠키를 포함한 요청
      });
      alert("Order Created!");
      navigate('/order/ordersuccess');  // 주문 생성 후 성공 페이지로 이동
    } catch (error) {
      console.error("Error creating order", error);
      alert("주문 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 총 금액 계산 함수
  const calculateTotalPrice = () => {
    const total = totalPrice - couponDiscount - pointsUsage + shippingCost;
    return total < 0 ? 0 : total;  // 0 미만으로는 안되도록 처리
  };

  // 날짜 계산: 오늘 날짜와 최대 날짜를 계산
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);
  const maxDateString = maxDate.toISOString().split('T')[0];  // 최대 날짜를 yyyy-mm-dd 형태로 설정

  // 결제 수단 선택 함수
  const handlePaymentSelection = (pg, method, name) => {
    setPaymentMethod(method);
    setPayPg(pg);
    setPaymentMethodName(name);
  };

  // 주소 검색 팝업 완료 후 콜백 함수
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
      setRoadAddress(fullAddress);  // 도로명 주소
    }
  };

  // 주소 검증 함수 (우편번호, 도로명 주소, 상세 주소 체크)
  const validateAddress = () => {
    if (!zonecode || !roadAddress || !detailAddress) {
      setIsAddressValid(false);
      alert("배송 정보를 모두 입력해주세요.");
      return false;
    }
    setIsAddressValid(true);
    return true;
  };

  // 주소 검색 버튼 클릭 시 Daum 주소 검색 팝업 호출
  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  // 배송 메모 변경 함수
  const handleMemoChange = (e) => {
    setDeliveryMemo(e.target.value);
  };

  // 배송 옵션 변경 함수
  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };


  const handleCouponApply = () => {
    const couponCode = document.getElementById("coupon-code").value;

    // 더미 쿠폰 데이터
    const validCoupons = [
      { code: "DISCOUNT10", discount: 1000 },
      { code: "SALE20", discount: 2000 },
    ];

    // 쿠폰 코드 검증
    const coupon = validCoupons.find(coupon => coupon.code === couponCode);

    if (!coupon) {
      setCouponErrors({ couponCode: true });  // 쿠폰 코드가 유효하지 않으면 오류 상태로 설정
      alert("유효하지 않은 쿠폰 코드입니다.");
      setCouponDiscount(0);  // 쿠폰이 유효하지 않으면 할인 금액을 0으로 설정
      return;
    }

    // 유효한 쿠폰인 경우 할인 적용
    setCouponDiscount(coupon.discount);
    setCouponErrors({ couponCode: false });  // 오류 상태 초기화
    alert(`${coupon.discount.toLocaleString()} 원 할인 적용되었습니다.`);
  };


  // 모든 동의 항목이 체크되었는지 확인
  const allAgreed = isPersonalInfoAgreed && isTermsAgreed && isPaymentAgreed;

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  // 수량 증가 함수
  const increasecount = () => {
    setcount(prevcount => prevcount + 1);
  };

  // 수량 감소 함수 (최소 1로 제한)
  const decreasecount = () => {
    if (count > 1) {
      setcount(prevcount => prevcount - 1);
    }
  };

  const totalPrice = product.price * count;

  // 결제 처리 함수 (간편 결제 연동)
  const onClickPayment = (product, couponDiscount, totalPrice) => {
    const { IMP } = window;
    IMP.init("imp87433075");  // 결제 모듈 초기화

    const data = {
      pg: payPg,  // 결제 PG사
      pay_method: paymentMethod,  // 결제 방식
      merchant_uid: `mid_${new Date().getTime()}`,  // 주문번호
      amount: totalPrice - couponDiscount,  // 결제 금액
      name: product.name,  // 주문명
      buyer_name: userName,
      buyer_email: userEmail,
      buyer_email: roadAddress + detailAddress,
      buyer_postcode: zonecode,
    };

    // 결제 요청
    IMP.request_pay(data, callback);
  };

  // 결제 완료 후 콜백 처리 함수
  const callback = (response) => {
    const { success, error_msg } = response;
    if (success) {
      createOrder();  // 결제 성공 시 주문 생성
      alert("결제 성공");
    } else {
      alert(`결제 실패: ${error_msg}`);  // 결제 실패 시 메시지 출력
    }
  };

  // 결제 버튼 클릭 시 결제 진행
  const handlePaymentClick = () => {
    onClickPayment(product, couponDiscount, calculateTotalPrice());
  };

  // 주문 클릭 시 동의사항 및 필수 항목 검증
  const handleOrderClick = () => {
    let newErrors = {
      zonecode: !zonecode,
      roadAddress: !roadAddress,
      detailAddress: !detailAddress,
    };

    if (!isPaymentAgreed) {
      alert("⚠️ 결제 동의에 체크해주세요.");
      return;
    }

    let missingFields = [];
    if (!zonecode) missingFields.push("우편번호");
    if (!roadAddress) missingFields.push("도로명 주소");
    if (!detailAddress) missingFields.push("상세 주소");

    if (missingFields.length > 0) {
      setErrors(newErrors);
      alert(`⚠️ 다음 필수 항목을 입력해주세요: \n\n${missingFields.join(", ")}`);
      return;
    }

    // 결제 진행
    createOrder();
  };
  const handleAddressChange = (e) => {
    const selectedId = Number(e.target.value);
    const selected = addressList.find(addr => addr.addressId === selectedId);

    console.log("선택된 주소 ID:", selectedId);
    console.log("찾아낸 주소 객체:", selected);

    if (selected) {
      setSelectedAddressId(selected.addressId);
      setRoadAddress(selected.address);
      setDetailAddress(selected.addressDetail);
      setZonecode(selected.zonecode);
    } else {
      setSelectedAddressId(null);
      setRoadAddress("");
      setDetailAddress("");
      setZonecode("");
    }
  };

  const fetchUserAddress = async () => {
    try {
      const res = await axios.get("/address", { withCredentials: true });
      if (res.data && res.data.length > 0) {
        setAddressList(res.data);
        const latest = res.data[res.data.length - 1];
        setSelectedAddressId(latest.addressId);
        setRoadAddress(latest.address);
        setDetailAddress(latest.addressDetail);
        setHasSavedAddress(true);
      }
    } catch (err) {
      console.error("주소 불러오기 실패:", err);
    }
  };
  const saveAddressToServer = async () => {
    try {
        const data = {
            address: roadAddress,
            addressDetail: detailAddress,
        };

        await axios.post("/address", data, { withCredentials: true });
        console.log("주소 저장 성공");
    } catch (error) {
        console.error("주소 저장 실패:", error);
    }
};
const getImageUrl = (imagePath) => {
  return imagePath.startsWith("/images/item/")
    ? `http://localhost:8080${imagePath}`
    : imagePath;
};
  return (
    <div className="order">
      <h1>결제하기</h1>

      <div className="order_product_container">

        <div className="cnt-left">
          <div className='order_product_info'>
            <h2>주문상품정보</h2>
            <div className="order_product_item">
              <img
                src={getImageUrl(product.image)}
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
                        <p>이름: {userName || "로그인 필요"}</p>
                        <p>전화번호: 010-1234-1234</p>
                      
                    </div>

                    {/* 배송 정보 */}
                    <div className="delivery_info">
                        <h2>배송 정보</h2>
                        <div className="input-group">
                            <label htmlFor="addressSelect">주소 선택</label>
                            <select
                                id="addressSelect"
                                className="styled-select"
                                value={selectedAddressId || ""}
                                onChange={handleAddressChange}
                            >
                                <option value="">주소를 선택하세요</option>
                                {addressList.map((addr) => (
                                    <option key={addr.addressId} value={addr.addressId}>
                                        {addr.address} {addr.addressDetail}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>우편번호</label>
                            <div className="input-container">
                                <input value={zonecode} readOnly />
                                <button onClick={handleClick} className="postcode-btn">우편번호 찾기</button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>도로명 주소</label>
                            <input value={roadAddress} readOnly />
                        </div>
                        <div className="input-group">
                            <label>상세 주소</label>
                            <input value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>배송 옵션 선택</label>
                            <select value={deliveryOption} onChange={handleDeliveryOptionChange} className="dropdown">
                                <option value="standard">일반 배송</option>
                                <option value="express">익스프레스 배송</option>
                                <option value="overnight">하룻밤 배송</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>배송 메모</label>
                            <textarea value={deliveryMemo} onChange={handleMemoChange} rows="3" />
                        </div>
                    </div>

                    {/* 쿠폰 / 포인트 */}
                    <div className="coupon">
                        <h2>쿠폰 / 포인트</h2>
                        <div className="coupon-field">
                            <label>쿠폰 코드</label>
                            <div className="coupon-input-group">
                                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                <button onClick={handleCouponApply}>쿠폰 적용</button>
                            </div>
                        </div>
                        <div className="coupon-field">
                            <label>포인트 사용</label>
                            <div className="coupon-input-group">
                                <input
                                    type="number"
                                    value={pointsUsage}
                                    onChange={(e) => setPointsUsage(Number(e.target.value))}
                                />
                                <button onClick={() => setPointsUsage(totalPrice)}>전액 사용</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cnt-right">
                    {/* 최종 결제 금액 */}
                    <div className="order-price">
                        <h2>최종 결제 금액</h2>
                        <div className="price-details">
                            <div className="price-item"><label>상품 가격</label><p>{totalPrice.toLocaleString()} 원</p></div>
                            <div className="price-item"><label>쿠폰 할인</label><p>{couponDiscount.toLocaleString()} 원</p></div>
                            <div className="price-item"><label>포인트 사용</label><p>{pointsUsage.toLocaleString()} 원</p></div>
                            <div className="price-item"><label>배송비</label><p>{shippingCost.toLocaleString()} 원</p></div>
                        </div>
                        <div className="final-price">
                            <h3>최종 결제금액</h3>
                            <p>{calculateTotalPrice().toLocaleString()} 원</p>
                        </div>
                    </div>

                    {/* 결제 방법 */}
                    <div className="pay-info">
                        <h2>결제 방법 선택</h2>
                        <table className="payment-table">
                            <tbody>
                                <tr>
                                    <td onClick={() => handlePaymentSelection("kicc", "card", "신용카드")} className={`payment-option-cell ${paymentMethodName === "신용카드" ? 'selected' : ''}`}>
                                        <label className="payment-option">신용카드</label>
                                    </td>
                                    <td onClick={() => handlePaymentSelection("kakaopay", "EASY_PAY", "카카오페이")} className={`payment-option-cell ${paymentMethodName === "카카오페이" ? 'selected' : ''}`}>
                                        <label className="payment-option">카카오페이</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={() => handlePaymentSelection("무통장", "bank_transfer", "무통장입금")} className={`payment-option-cell ${paymentMethodName === "무통장입금" ? 'selected' : ''}`}>
                                        <label className="payment-option">무통장 입금</label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p><span className="highlight">{paymentMethodName}</span>를 선택하셨습니다.</p>

                        {paymentMethodName === "무통장입금" && (
                            <div className="bank-details">
                                <div>
                                    <label>입금 은행</label>
                                    <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                                        <option value="">선택</option>
                                        <option value="국민은행">국민은행 / 123-456-789</option>
                                        <option value="하나은행">하나은행 / 456-789-123</option>
                                        <option value="신한은행">신한은행 / 789-123-456</option>
                                    </select>
                                </div>
                                <div>
                                    <label>입금자 이름</label>
                                    <input value={depositor} onChange={(e) => setDepositor(e.target.value)} />
                                </div>
                                <div>
                                    <label>입금 예정일</label>
                                    <input type="date" value={depositDate} onChange={(e) => setDepositDate(e.target.value)} min={today.toISOString().split('T')[0]} max={maxDateString} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 결제 동의 */}
                    <div className="payment-cnt">
                        <h2>결제 전 동의사항</h2>
                        <div className="checkbox-container">
                            <label><input type="checkbox" checked={isPersonalInfoAgreed} onChange={() => setIsPersonalInfoAgreed(!isPersonalInfoAgreed)} /> 개인정보 처리방침에 동의합니다.</label>
                        </div>
                        <div className="checkbox-container">
                            <label><input type="checkbox" checked={isTermsAgreed} onChange={() => setIsTermsAgreed(!isTermsAgreed)} /> 이용약관에 동의합니다.</label>
                        </div>
                        <div className="checkbox-container">
                            <label><input type="checkbox" checked={isPaymentAgreed} onChange={() => setIsPaymentAgreed(!isPaymentAgreed)} /> 결제에 동의합니다.</label>
                        </div>

                        <button className="pay-button" onClick={createOrder}>결제하기</button>
                        <button className="real-pay-button" onClick={handlePaymentClick}>실제 결제하기</button>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Order;
