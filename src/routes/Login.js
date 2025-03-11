import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import kakao from "./kakaoImg.png";

const Location = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 로그인 성공 시 로컬 스토리지에 로그인 상태 저장
    localStorage.setItem('isLoggedIn', 'true');

    // 로그인 후 홈 화면으로 이동
    navigate('/');
    window.location.replace("/")  // 메인 페이지로 이동
  };

  return (
    <div className="login_container">
      <div className="login_box">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input_group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              name="username"
              placeholder="아이디"
              required
            />
          </div>
          <div className="input_group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="비밀번호"
              required
            />
          </div>
          <button type="submit" className="login_button">로그인</button>
        </form>
        <div className="lost_id_pw">
          <a href="#lost_id_pw">아이디/비밀번호찾기</a><hr />
          <a href="#join">회원가입</a>
        </div>

        <div className="sns_login">
          <label>다른 계정으로 <br /> 로그인하기</label>
          <img src={kakao} alt="kakao" className="kakao_img" />
        </div>
      </div>
    </div>
  );
};

export default Location;
