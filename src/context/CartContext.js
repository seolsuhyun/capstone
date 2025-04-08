import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLogin } from "./LoginContext";
const CartContext = createContext();



export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { userEmail } = useLogin(); // 로그인한 사용자의 이메일

    const fetchCart = async () => {
        try {
            // 1️⃣ 장바구니 목록 가져오기
            const res = await axios.get("/cart", { withCredentials: true });
            const cartItems = res.data.cartItemDtoList;

            // 2️⃣ 전체 상품 목록 가져오기
            const itemListRes = await axios.get("/items/list", { withCredentials: true });
            const allItems = itemListRes.data; // ItemDto[]

            // 3️⃣ cartItem과 allItems를 itemId 기준으로 merge
            const enrichedItems = cartItems.map((cartItem) => {
                const matchedItem = allItems.find((item) => item.id === cartItem.itemId);

                return {
                    ...cartItem,
                    name: matchedItem?.name || `상품 #${cartItem.itemId}`,
                    price: matchedItem?.price || 0
                };
            });

            setCartItems(enrichedItems);
        } catch (err) {
            console.error("장바구니 불러오기 실패:", err);
            setCartItems([]);
        }
    };


    // 💡 email이 바뀌면 장바구니 다시 불러오기!
    useEffect(() => {
        if (userEmail) fetchCart();
        else setCartItems([]);
    }, [userEmail]);


    // 🛒 장바구니에 상품 추가
    const addToCart = async (product) => {
        try {
            const body = {
                itemId: product.id, // 백엔드에 필요한 필드
                count: 1
            };
            await axios.post("/cart", body, { withCredentials: true });
            fetchCart(); // 최신 장바구니 다시 불러오기
        } catch (err) {
            console.error("장바구니 추가 실패:", err);
            alert("장바구니 추가 중 오류가 발생했습니다.");
        }
    };

    // ❌ 장바구니 항목 삭제
    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`/cart/${itemId}/delete`, { withCredentials: true });
            fetchCart();
        } catch (err) {
            console.error("삭제 실패:", err);
        }
    };

    const updateQuantity = async (itemId, newCount) => {
        try {
            const currentItem = cartItems.find((item) => item.itemId === itemId);
            if (!currentItem) return;

            const currentCount = currentItem.count;

            if (newCount <= 0) {
                await removeFromCart(itemId);
                return;
            }

            const diff = newCount - currentCount;

            if (diff > 0) {
                // 수량 증가: diff만큼 POST 여러 번 호출
                for (let i = 0; i < diff; i++) {
                    await axios.post(
                        "/cart",
                        { itemId, count: 1 },
                        { withCredentials: true }
                    );
                }
            } else if (diff < 0) {
                // 수량 감소: diff만큼 PATCH 호출
                for (let i = 0; i < Math.abs(diff); i++) {
                    await axios.patch(`/cart/${itemId}/decrease`, {}, { withCredentials: true });
                }
            }

            fetchCart();
        } catch (err) {
            console.error("수량 업데이트 실패:", err);
        }
    };



    // ➖ 수량 감소 (1개일 경우 자동 삭제)
    const decreaseQuantity = async (itemId) => {
        try {
            await axios.patch(`/cart/${itemId}/decrease`, {}, { withCredentials: true });
            fetchCart();
        } catch (err) {
            console.error("수량 감소 실패:", err);
        }
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, updateQuantity, fetchCart }}
        >
            {children}
        </CartContext.Provider>
    );

};


export const useCart = () => useContext(CartContext);
