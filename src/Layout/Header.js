import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import axios from 'axios';
import './Header.css';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import nav_bar_img from "./nav-bar.png";
import shopping_cart_img from "./shopping_cart.png";
import order_img from "./person.png";
import customer_img from "./person.png";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, login, userName } = useLogin();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/loginOk', {
          withCredentials: true,
        });

        if (response.status === 200) {
          login(response.data.name, response.data.email, response.data.role);
        }
      } catch (error) {
        logout();
      }
    };

    checkLoginStatus();
  }, [login, logout]);

  const handleLoginLogout = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      try {
        await axios.get('http://localhost:8080/logout', { withCredentials: true });
        logout();
        alert("로그아웃 했습니다.");
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    } else {
      navigate('/Login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="Header">
      <div className="header-top">
        <img src='/Logo.png' className='logo' onClick={() => navigate('/')} />
        <div className="search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="매장운영이 쉬워지는 식자재몰, 푸딩팩토리"
              className="search-bar"
            />
            <button type="submit" className="search-btn">
              <img src={search_img} alt="Search" className="search-img" />
            </button>
          </form>
        </div>
        <div className="nav-links">
          <a href="/Login">로그인</a>
          <a href="/Signup">회원가입</a>
          <a href="/Orders">주문조회</a>
          <a href="/CustomerService">고객센터</a>
        </div>
      </div>

      <div className="header-bottom">
        <ul className="category-menu">
          <li className="category-item" onClick={() => navigate('/category')}>카테고리</li>
          <li className="category-item" onClick={() => navigate('/new')}>신상품</li>
          <li className="category-item" onClick={() => navigate('/best')}>베스트</li>
          <li className="category-item" onClick={() => navigate('/discount')}>할인특가</li>
          <li className="category-item" onClick={() => navigate('/coming-soon')}>출시예정</li>
          <li className="category-item" onClick={() => navigate('/brands')}>입점브랜드</li>
          <li className="category-item" onClick={() => navigate('/events')}>이벤트</li>
          <li className="category-item" onClick={() => navigate('/recipes')}>레시피</li>
        </ul>

        <nav className="icon-menu">
          <img src={mypage_img} alt="mypage" className="nav-icon" onClick={() => navigate('/MyPage')} />
          <img src={shopping_cart_img} alt="shopping_cart" className="nav-icon" onClick={() => navigate('/Cart')} />
          <img src={order_img} alt="order" className="nav-icon" onClick={() => navigate('/Orders')} />
          
        </nav>
      </div>
    </header>
  );
};

export default Header;
