import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import axios from 'axios';
import './Header.css';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import nav_bar_img from "./nav-bar.png";
import shopping_cart_img from "./shopping_cart.png";


const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, login, userName } = useLogin();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/loginOk', {
          withCredentials: true,
        });

        if (response.status === 200) {
          login(response.data.name);
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

  const handleNameClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/#MyPage');
    }
  };

  const handleCategoryClick = (category) => {

    navigate(`/category/${category}`);
  };

  return (
    <header className="Header">
      <div className="event">
        <a href="/Event" className='event_lab'>이벤트,공지사항</a>
      </div>
      <div>
        <img src='/Logo.png' className='logo' onClick={() => navigate('/')} />

        {/* 서브 카테고리 메뉴 */}
        <ul className="category-menu">
          {['Best', 'New', '구이류', '스프류', '파스타류'].map((category) => (
            <li key={category} className="category-item" onClick={() => handleCategoryClick(category)}>
              {category}
            </li>
          ))}
        </ul>

        <div className="search">
          <img
            src={search_img}
            alt="Search"
            className="search_img"
            onClick={() => navigate('/All_Items')}
          />
          <input
            type="text"
            placeholder="검색..."
            className="search_bar"
          />
        </div>
        <nav>
          <ul className="navi_ul">
            <li className="navi_item">
              <img
                src={shopping_cart_img}
                alt="shopping_cart"
                className="nav_img"
                onClick={() => navigate('/Cart')}
              />
            </li>
            <li className="navi_item">
              <img
                src={mypage_img}
                alt="mypage"
                className="nav_img"
                onClick={() => navigate('/MyPage')}
              />
            </li>
            <li className="navi_item">
              <img
                src={nav_bar_img}
                alt="nav_bar"
                className="nav_img"
              />
            </li>
          </ul>
        </nav>
        <nav>
          <ul className="login_nav_ul">
            <li className='login_li'>
              {isLoggedIn ? (
                <a href="/" onClick={handleNameClick} className='login_a'>
                  {userName}님
                </a>
              ) : (
                <a href="/" onClick={handleLoginLogout} className='login_a'>
                  로그인
                </a>
              )}
            </li>

            {!isLoggedIn && (
              <li className='Signup_li'>
                <a href="/Signup" className='Signup_a'>회원가입</a>
              </li>
            )}

            {isLoggedIn && (
              <li className='Signup_li'>
                <a href="/" onClick={handleLoginLogout} className='Signup_a'>로그아웃</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;