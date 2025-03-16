import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import nav_bar_img from "./nav-bar.png";
import shopping_cart_img from "./shopping_cart.png";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useLogin();  // 로그인 상태와 로그인/로그아웃 함수 사용

  const handleLoginLogout = (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      logout();  // 로그아웃 처리
      navigate('/');
    } else {
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
                {isLoggedIn ? '로그아웃' : '로그인'}
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
