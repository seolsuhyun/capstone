import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import { Link } from "react-router-dom";
import shopping_cart_img from "./shopping_cart.png";

const events = [
  { id: 1, image: '/event1.jpg', alt: '이벤트 1' },
  { id: 2, image: '/event2.jpg', alt: '이벤트 2' },
  { id: 3, image: '/event3.jpg', alt: '이벤트 3' },
  { id: 4, image: '/event4.jpg', alt: '이벤트 4' },
  { id: 5, image: '/event5.jpg', alt: '이벤트 5' },
];

const MainPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const categoryMap = {
    전체: null,
    '구이/볶음': 'ROAST',
    '국물요리': 'SOUP',
    '파스타': 'PASTA',
    '안주': 'ANJU',
  };
  
  const categories = Object.keys(categoryMap); // ['전체', '구이/볶음', '국물요리', '파스타', '안주']
  
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const timeoutRef = useRef(null);
  const delay = 4000;
  const navigate = useNavigate();
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleClick = () => {
    navigate('/Q&A');
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      goToNext();
    }, delay);
    return () => resetTimeout();
  }, [currentIndex]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/items/list")
      .then((response) => {
        const allItems = response.data;
  
        const newItems = allItems.filter(item => item.itemStatus === 'NEW');
      const shuffledNew = [...newItems].sort(() => 0.5 - Math.random());
      const selectedNew = shuffledNew.slice(0, 4);
        const bestItems = allItems.filter(item => item.itemStatus === 'BEST');
  
      
        setNewProducts(selectedNew);
        setBestProducts(bestItems);
      })
      .catch((error) => {
        console.error("에러", error);
      });
  }, []);
  

  useEffect(() => {
    const backendCategory = categoryMap[selectedCategory];
  
    if (!backendCategory) {
      setFilteredItems(bestProducts); // BEST 상품 중 전체
    } else {
      const filtered = bestProducts.filter(item => item.category === backendCategory);
      setFilteredItems(filtered);
    }
  }, [selectedCategory, bestProducts]);
  

  if (newProducts.length === 0) return null;

  const mainItem = newProducts[0];
  const sideItems = newProducts.slice(1);
  



  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };



  return (
    <div className="main-page">
      <div className='main-slider'>
        <div className="slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {events.map((event, idx) => (
            <div key={event.id} className={`slide ${idx === currentIndex ? 'active' : ''}`}>
              <img src={event.image} alt={event.alt} className="slider-image" />
            </div>
          ))}
        </div>


        <div className="slider-indicator">
          {events.map((_, idx) => (
            <div
              key={idx}
              className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}  </div>

        <button className="arrow left" onClick={goToPrev}><ChevronLeft /></button>
        <button className="arrow right" onClick={goToNext}><ChevronRight /></button>
      </div>
      {/* 무엇이든 물어보세요 버튼 */}
      <button className="chat-floating-button" onClick={handleClick}>
        
        <span className="chat-text" >무엇이든 물어보세요 😊</span>
      </button>

      <div className="main-new-menu-section">
        <h3>야심차게 준비한</h3>
        <h2>이번주 신상메뉴</h2>
        <div className="main-new-menu-box">
          {/* 메인 아이템 */}
          <div className="main-new-item">
            <img src={mainItem.image} alt={mainItem.name} className="main-new-image" />
            <div className="main-new-desc">
              <div className="main-brand">{mainItem.category}</div>
              <div className="main-title">{mainItem.name}</div>
              <div className="main-desc">{mainItem.content}</div>
              <div className="main-price">
                <span className="main-original">{mainItem.price.toLocaleString()}원</span>
                <div className="buy-button-container">
                  <Link to={`/detail/${mainItem.id}`} state={mainItem} className="buy-button">
                    <img src={shopping_cart_img} alt="장바구니" />

                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드 아이템 */}
          <div className="main-side-new-items">
            {sideItems.map((item, idx) => (
              <div key={idx} className="main-side-item">
                <img src={item.image} alt={item.name} className="side-image" />
                <div className="main-desc-box">
                  <div className="main-title">{item.name}</div>
                  <div className="side-price-row">
                    <span className="main-original">{item.price.toLocaleString()}원</span>
                    <Link to={`/detail/${item.id}`} state={item} className="buy-button small">
                      <img src={shopping_cart_img} alt="장바구니" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
        <div className="more-button-wrapper">
          <button className="more-button" onClick={() => navigate('/category/new')}>신상품 더보기 &gt;</button>
        </div>
        
      </div>
      
      <hr className='main-hr'/>
      <div className="discount-section">
        
        <h4 className="discount-subtitle">놓치면 안되는 득템찬스!</h4>
        <h2 className="discount-title">금주할인특가</h2>

        <div className="discount-items">
          {bestProducts.map((item, idx) => (
            <div key={idx} className="discount-item">
              <img src={item.image} alt={item.name} className="discount-image" />
              <div className="discount-brand">푸딩팩토리</div>
              <div className="discount-name">{item.name}</div>

              <div className="discount-price-box">
                <div className="discount-final-row">
                  <div className="discount-original">{item.price.toLocaleString()}원</div>
                  <Link to={`/detail/${item.id}`} state={item} className="buy-button small">
                    <img src={shopping_cart_img} alt="장바구니" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="more-button-wrapper">
          <button className="more-button" onClick={() => navigate('/category/discount')}>상품 더보기 &gt;</button>
        </div>
      </div>
     
      <div className="category-best-section">
       <hr/>
        <h2>카테고리별 베스트</h2>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="category-products">
          {filteredItems.slice(0, 5).map((item) => (
            <div key={item.id} className="category-item">
              <img src={item.image} alt={item.name} className="category-img" />
              <div className="category-name">{item.name}</div>
              <div className="category-price">{item.price.toLocaleString()}원</div>
              <Link to={`/detail/${item.id}`} state={item} className="buy-button small">
                <img src={shopping_cart_img} alt="장바구니" />
              </Link>
            </div>
          ))}
        </div>
        <div className="more-button-wrapper">
          <button className="more-button" onClick={() => navigate('/category/best')}>상품 더보기 &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
