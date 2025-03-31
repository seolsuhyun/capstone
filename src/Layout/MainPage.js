import React, { useState, useEffect } from "react";
import Slider from "react-slick"; // 이미지 슬라이더 라이브러리
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./MainPage.css"

// 임시 데이터 (실제로는 API에서 불러옵니다)
const foodCategories = [
  { id: 1, name: "과일", icon: "🍎" },
  { id: 2, name: "채소", icon: "🥬" },
  { id: 3, name: "정육", icon: "🥩" },
  { id: 4, name: "수산물", icon: "🍣" },
  { id: 5, name: "유제품", icon: "🧀" },
];

const weeklyDeals = [
  { id: 1, name: "유기농 사과 1kg", price: 12000, discount: "20%", image: "/images/apple.jpg" },
  { id: 2, name: "한우 등심 200g", price: 25000, discount: "15%", image: "/images/beef.jpg" },
];

const MainPage = () => {
  const [products, setProducts] = useState([]);

  // API에서 상품 데이터 불러오기 (예시)
  useEffect(() => {
    // fetch("/api/products").then(...)
    setProducts(weeklyDeals); // 임시 데이터 사용
  }, []);

  // 슬라이더 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
  };

  return (
    <div className="main-page">
      {/* 1. 히어로 배너 (메인 슬라이더) */}
      <section className="hero-banner">
        <Slider {...sliderSettings}>
          <div>
            <img src="/banners/summer-sale.jpg" alt="여름 특가" />
          </div>
          <div>
            <img src="/banners/organic-food.jpg" alt="유기농 특집" />
          </div>
        </Slider>
      </section>

      {/* 2. 음식 카테고리 아이콘 */}
      <section className="category-section">
        <h2>카테고리</h2>
        <div className="category-grid">
          {foodCategories.map((category) => (
            <div key={category.id} className="category-item">
              <span className="category-icon">{category.icon}</span>
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 주간 특가 상품 */}
      <section className="weekly-deals">
        <h2>🔥 이번 주 특가</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>
                <span className="discount">{product.discount}</span>
                <span className="price">{product.price.toLocaleString()}원</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 신선 식품 추천 */}
      <section className="fresh-recommendation">
        <h2>🍃 오늘의 신선 식품</h2>
        {/* 동적 데이터로 구현 가능 */}
      </section>

      {/* 5. 이벤트 배너 */}
      <section className="event-banner">
        <img src="/banners/first-order-discount.jpg" alt="첫 주문 30% 할인" />
      </section>
    </div>
  );
};

export default MainPage;