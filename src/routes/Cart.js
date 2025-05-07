import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import axios from "axios";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [recommendedItems, setRecommendedItems] = useState([]);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    console.log("현재 장바구니 데이터:", cartItems);

    useEffect(() => {
        // 백엔드 상품 목록 불러와서 랜덤 추천
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get("/items/list", { withCredentials: true }); //데이터베이스 변경하면 이 부분 고치기기
                const allItems = res.data;

                // 상품 무작위
                const shuffled = [...allItems].sort(() => 0.5 - Math.random());
                // 3개만 잘라서 추천
                const selected = shuffled.slice(0, 3);
                setRecommendedItems(selected);
            } catch (err) {
                console.error("추천 상품 불러오기 실패:", err);
            }
        };

        fetchRecommendations();
    }, []);


    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("장바구니가 비어 있습니다.");
            return;
        }
        navigate("/orders", { state: { product: cartItems } });
        console.log("주문 페이지로 넘길 데이터:", cartItems);
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + (item.price || 0) * item.count,
        0
    );
    const getImageUrl = (imagePath) => {
        return imagePath.startsWith("/images/item/")
          ? `http://localhost:8080${imagePath}`
          : imagePath;
      };
    return (
        <div className="cart">
            <h1>장바구니</h1>
            {cartItems.length === 0 ? (
                <p>장바구니가 비어 있습니다.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.itemId} className="cart-item">
                            <img
                                src={getImageUrl(item.image)}
                                alt={item.name || "상품 이미지"}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h2>{item.name || `상품 #${item.itemId}`}</h2>
                                <p>{item.price ? `${item.price.toLocaleString()}원` : "가격 정보 없음"}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.itemId, item.count - 1)}>-</button>
                                    <span>{item.count}</span>
                                    <button onClick={() => updateQuantity(item.itemId, item.count + 1)}>+</button>
                                </div>
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => removeFromCart(item.itemId)}
                            >
                                삭제
                            </button>
                        </div>
                    ))}

                    <div className="total-price">
                        <h2>총 가격: {totalPrice.toLocaleString()}원</h2>
                    </div>
                    <div className="recommended-section">
                        <h2 className="recommended-title">고객님, 이 상품도 함께 보시면 좋아요!</h2>
                        <div className="recommended-items">
                            {recommendedItems.map((item) => (
                                <div key={item.id} className="recommended-card">
                                 <img src={getImageUrl(item.image)} alt={item.name} className="recommended-image" />
                                    <div className="recommended-info">
                                        <h3>{item.name}</h3>
                                        <p>{item.price.toLocaleString()}원</p>
                                        <button
                                            className="add-button"
                                            onClick={() => {
                                                addToCart(item);
                                                alert("상품이 장바구니에 담겼습니다!");
                                            }}
                                        >
                                            + 장바구니
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="checkout-container">
                        <button className="checkout-button" onClick={handleCheckout}>
                            주문하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
