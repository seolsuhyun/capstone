import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import axios from 'axios';
import './Header.css';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import shopping_cart_img from "./shopping_cart.png";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, login, userName } = useLogin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get('http://localhost:8080/loginOk', {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          login(response.data.name, response.data.email, response.data.role, response.data.id);
        }
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          logout();
        } else {
          console.error("로그인 상태 확인 실패:", error);
        }
      }
    }, 300); // 💡 300ms 지연
  
    return () => clearTimeout(timer);
  }, [login, logout]);
  
  const handleLogout = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      try {
        await axios.get('http://localhost:8080/logout', { withCredentials: true });
        logout();
        alert("로그아웃 했습니다.");
        navigate('/'); // 로그아웃 후 홈으로 이동
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    } else {
      alert("로그인 후 이용해주세요.");
    }
  };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="Header">
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <a href="/" onClick={handleLogout}>로그아웃</a>
            <a href="/MyPage">{userName} 님</a>
          </>
        ) : (
          <>
            <a href="/Login">로그인</a>
            <a href="/Signup">회원가입</a>
          </>
        )}
      
        <a href="/Q&A">고객문의</a>
      </div>

      <div className="header-top">
        <img src='/Logo.png' className='logo' onClick={() => navigate('/')} />
        <div className="search">
          <form onSubmit={(e) => { e.preventDefault(); navigate(`/search?query=${encodeURIComponent(searchTerm)}`); }} className="search-form">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="부기푸드" className="search-bar" />
            <button type="submit" className="search-btn">
              <img src={search_img} alt="Search" className="search-img" />
            </button>
          </form>
        </div>

        <nav className="icon-menu">
  <img
    src={mypage_img}
    alt="mypage"
    className="nav-icon"
    title="마이페이지"
    onClick={() => {
      if (isLoggedIn) {
        navigate('/MyPage');
      } else {
        alert("로그인 후 이용해주세요.");
        navigate('/');
      }
    }}
  />
  <img
    src={shopping_cart_img}
    alt="shopping_cart"
    className="nav-icon"
    title="장바구니"
    onClick={() => {
      if (isLoggedIn) {
        navigate('/Cart');
      } else {
        alert("로그인 후 이용해주세요.");
        navigate('/');
      }
    }}
  />
</nav>
      </div>

      <div className="header-bottom">
        <ul className="category-menu">
          <li className="category-item" onClick={toggleDropdown}>
            카테고리
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li onClick={() => navigate('/all')}>전체</li>
                  <li onClick={() => navigate('/category/구이류')}>구이/볶음</li>
                  <li onClick={() => navigate('/category/국물요리')}>국물 요리</li>
                  <li onClick={() => navigate('/category/파스타')}>파스타</li>
                  <li onClick={() => navigate('/category/안주')}>안주</li>
                </ul>
              </div>
            )}
          </li>
          <li className="category-item" onClick={() => navigate('/category/new')}>신상품</li>
          <li className="category-item" onClick={() => navigate('/category/best')}>베스트</li>
          <li className="category-item" onClick={() => navigate('/category/discount')}>할인특가</li>
        </ul>
      </div>

    </header>
  );
};

export default Header;
