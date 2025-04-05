import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    console.log("현재 장바구니 데이터:", cartItems);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("장바구니가 비어 있습니다.");
            return;
        }
        navigate("/order", { state: { product: cartItems } });
        console.log("주문 페이지로 넘길 데이터:", cartItems);
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + (item.price || 0) * item.count,
        0
    );

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
                                src={item.image}
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
