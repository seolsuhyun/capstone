import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import nav_bar_img from "./nav-bar.png";
import shopping_cart_img from "./shopping_cart.png";

const Header = () => {
  const navigate = useNavigate();

  // 로그인 상태를 상태 관리하고, 로컬 스토리지에서 초기값을 가져옴
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    // 로컬 스토리지에서 값이 없으면 'false', 있으면 그 값을 사용
    return storedLoginStatus ? storedLoginStatus === 'true' : false;
  });

  // isLoggedIn 상태가 변경될 때마다 로컬 스토리지에 값을 저장
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const handleLoginLogout = (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      // 로그아웃 처리
      setIsLoggedIn(false);
      // 로그아웃 후 로그인 페이지로 이동
      navigate('/');
    } else {
      // 로그인 페이지로 이동
      navigate('/Login');
    
    }
  };

  return (
    <header className="Header">
      <div className="event">
        <a href="/Event" className='event_lab'>이벤트,공지사항</a>
      </div>
      <div>
        <div className='logo' onClick={() => navigate('/')} />
        
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
              <a href="/" onClick={handleLoginLogout} className='login_a'>
                {isLoggedIn ? '로그아웃' : '로그인'} {/* 로그인 여부에 따라 텍스트 변경 */}
              </a>
            </li>
            {!isLoggedIn && (
              <li className='Signup_li'>
                <a href="/Signup" className='Signup_a'>회원가입</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
