import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import search_img from "./reading-glasses.png";
import mypage_img from "./person.png";
import nav_bar_img from "./nav-bar.png";
import shopping_cart_img from "./shopping_cart.png";
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn,logout, userName } = useLogin();  // 로그인 상태와 사용자 이름 사용

  const handleLoginLogout = (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      // 로그아웃 처리
      axios.get('http://localhost:8080/logoutOk')  // 백엔드의 로그아웃 API 호출
        .then(() => {
          logout();  // 로그인 상태 변경
          
          alert("로그아웃 했습니다.");
        })
        .catch((error) => {
          console.error("로그아웃 실패:", error);
        });
    } else {
      navigate('/Login');
    }
  };

  const handleNameClick = (e) => {
    e.preventDefault(); // a 태그가 기본적으로 페이지를 새로고침하는 걸 방지합니다.
    if (isLoggedIn) {
      navigate('/#MyPage');  // 로그인한 상태라면 마이페이지로 이동
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
              {/* 로그인 상태에 따라 다르게 표시 */}
              {isLoggedIn ? (
                // 로그인 상태에서 사용자 이름을 클릭 시 마이페이지로 이동
                <a href="/" onClick={handleNameClick} className='login_a'>
                  {userName}님
                </a>
              ) : (
                <a href="/" onClick={handleLoginLogout} className='login_a'>
                  로그인
                </a>
              )}
            </li>

            {/* 로그인 안 한 경우 회원가입 버튼을 보여줌 */}
            {!isLoggedIn && (
              <li className='Signup_li'>
                <a href="/Signup" className='Signup_a'>회원가입</a>
              </li>
            )}

            {/* 로그인 상태일 때, 로그아웃 버튼이 보이게 */}
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
