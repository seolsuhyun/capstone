import './Header.css';
import { useNavigate } from 'react-router-dom';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import nav_bar_img from "./nav-bar.png";
import shopping_cart_img from "./shopping_cart.png";

const Header = () => {
  const navigate = useNavigate();  // 페이지 이동을 위한 훅

  const handleImageClick = () => {
    navigate('/'); // 로고 클릭 시 홈으로 이동
  };

  return (
    <header className="Header">
      <div className="event">
        <a href="/Event" className='event_lab'>이벤트,공지사항</a>
      </div>
      <div>
        <div className='logo' onClick={handleImageClick}/> 
        
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

        {/* 로그인 및 회원가입 링크 */}
        <nav>
          <ul>
            <li className='login'>
              <a href="/Login" className='login_a'>로그인</a>
            </li>
            <li className='createAccount'>
              <a href="/CreateAccount" className='createAccount_a'>회원가입</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
