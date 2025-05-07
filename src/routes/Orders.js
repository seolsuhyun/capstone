import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Order.css";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useLogin } from "../context/LoginContext";
import axios from 'axios';
import { useCart } from "../context/CartContext";

function Orders() {
    const location = useLocation();
    const navigate = useNavigate();
    const open = useDaumPostcodePopup();
    const { userName, userCode } = useLogin();
    const products = location.state?.product || [];

    // 결제 관련 상태
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [payPg, setPayPg] = useState("kicc");
    const [paymentMethodName, setPaymentMethodName] = useState("신용카드");
    const [bankName, setBankName] = useState("");
    const [depositor, setDepositor] = useState("");
    const [depositDate, setDepositDate] = useState("");

    // 주소 및 배송
    const [zonecode, setZonecode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [deliveryMemo, setDeliveryMemo] = useState("");
    const [deliveryOption, setDeliveryOption] = useState("standard");
    const [hasSavedAddress, setHasSavedAddress] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // 할인/포인트
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const [pointsUsage, setPointsUsage] = useState(0);
    const [shippingCost, setShippingCost] = useState(3500);

    // 동의 체크
    const [isPersonalInfoAgreed, setIsPersonalInfoAgreed] = useState(false);
    const [isTermsAgreed, setIsTermsAgreed] = useState(false);
    const [isPaymentAgreed, setIsPaymentAgreed] = useState(false);

    const [errors, setErrors] = useState({
        zonecode: false,
        roadAddress: false,
        detailAddress: false,
    });

    const { fetchCart } = useCart(); //장바구니 비우기

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);
    const maxDateString = maxDate.toISOString().split('T')[0];

    const totalPrice = products.reduce((acc, item) => acc + item.price * item.count, 0);
    const calculateTotalPrice = () => {
        const total = totalPrice - couponDiscount - pointsUsage + shippingCost;
        return total < 0 ? 0 : total;
    };

    const handlePaymentSelection = (pg, method, name) => {
        setPaymentMethod(method);
        setPayPg(pg);
        setPaymentMethodName(name);
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType === 'R') {
            if (data.bname) extraAddress += data.bname;
            if (data.buildingName) {
                extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress ? ` (${extraAddress})` : '';
        }
        setZonecode(data.zonecode);
        setRoadAddress(fullAddress);
        setSelectedAddressId(null); // 새 주소 수동 입력 시 선택 초기화

    };
    useEffect(() => {
        fetchUserAddress();
    }, []);


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

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    const handleMemoChange = (e) => setDeliveryMemo(e.target.value);
    const handleDeliveryOptionChange = (e) => setDeliveryOption(e.target.value);

    const validateAddress = () => {
        if (!roadAddress || !detailAddress) {
            alert("배송 정보를 모두 입력해주세요.");
            return false;
        }
        return true;
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





    const handleCouponApply = () => {
        const validCoupons = [
            { code: "DISCOUNT10", discount: 1000 },
            { code: "SALE20", discount: 2000 },
        ];
        const found = validCoupons.find(c => c.code === couponCode);
        if (!found) {
            alert("유효하지 않은 쿠폰 코드입니다.");
            setCouponDiscount(0);
            return;
        }
        setCouponDiscount(found.discount);
        alert(`${found.discount.toLocaleString()}원 쿠폰이 적용되었습니다!`);
    };

    const allAgreed = isPersonalInfoAgreed && isTermsAgreed && isPaymentAgreed;

    const onClickPayment = () => {
        const { IMP } = window;
        IMP.init("imp87433075");  // 아임포트 상점 식별코드

        const orderName = products.map(item => item.name).join(", ").slice(0, 50); // 주문명 (여러 개일 경우)

        const data = {
            pg: payPg,
            pay_method: paymentMethod,
            merchant_uid: `mid_${new Date().getTime()}`,
            amount: calculateTotalPrice(),
            name: orderName,
            buyer_name: userName,

            buyer_addr: roadAddress + " " + detailAddress,
            buyer_postcode: zonecode,
        };

        IMP.request_pay(data, callback);
    };

    const handlePaymentClick = () => {
        if (!validateAddress()) return;
        if (!isPaymentAgreed) {
            alert("⚠️ 결제 동의에 체크해주세요.");
            return;
        }
        onClickPayment();  // 결제창 띄우기
    };


    const callback = (response) => {
        const { success, error_msg } = response;
        if (success) {
            createOrder();  // 실제 주문 생성
            alert("결제 성공!");
        } else {
            alert(`결제 실패: ${error_msg}`);
        }
    };


    const createOrder = async () => {
        if (!validateAddress()) return;
        if (!allAgreed) {
            alert("모든 동의사항을 체크해주세요.");
            return;
        }

        if (!hasSavedAddress) { // 👉 주소가 없는 경우에만 confirm 띄우기
            const wantToSave = window.confirm("다음에도 이 주소를 사용하시겠습니까?");
            if (wantToSave) {
                await saveAddressToServer();
            }
        }

        const orderDtos = products.map(item => ({
            id: item.itemId,
            count: item.count
        }));

        try {
            await axios.post("/orders", orderDtos, { withCredentials: true });
            await fetchCart();
            alert("장바구니 주문이 완료되었습니다!");
            navigate("/order/ordersuccess");
        } catch (err) {
            console.error("주문 실패:", err);
            alert("주문 처리 중 오류가 발생했습니다.");
        }
    };
    const getImageUrl = (imagePath) => {
        return imagePath.startsWith("/images/item/")
          ? `http://localhost:8080${imagePath}`
          : imagePath;
      };
    return (
        <div className="order">
            <h1>장바구니 결제하기</h1>
            <div className="order_product_container">
                <div className="cnt-left">
                    {/* 주문 상품 정보 */}
                    <div className="order_product_info">
                        <h2>주문상품정보</h2>
                        {products.map((item, idx) => (
                            <div key={idx} className="order_product_item">
                                <img src={getImageUrl(item.image)} alt={item.name} style={{ width: "100px", height: "100px" }} />
                                <div className="order_product_name_price">
                                    <h3>{item.name}</h3>
                                    <p>{item.count}개 / {(item.price * item.count).toLocaleString()}원</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 주문자 정보 */}
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

export default Orders;
