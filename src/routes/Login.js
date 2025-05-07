import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLogin } from "../context/LoginContext";  // useLogin 훅을 import
import "./Login.css";
import kakao from "./kakaoImg.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useLogin();  // 로그인 상태를 변경하는 함수
  const [userCode, setuserCode] = useState('');  // userCode 상태 추가
  const [password, setPassword] = useState('');

  // 카카오 로그인 URL 생성
  const kakaoClientId = 'acfbac7198077c2aa2e004e4e3c797c5';  // 환경변수에서 받아온 값
  const redirectUri = 'http://localhost:8080/oauth/login/callback';  // 환경변수에서 받아온 값
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('userCode', userCode); 
      formData.append('password', password);
  
      // 백엔드 로그인 요청
      const response = await axios({
        url: 'http://localhost:8080/loginProc',
        method: 'POST',
        data: formData,
        withCredentials: true,
      });
  
      // 로그인 성공 처리
      if (response.status === 200) {
        alert('로그인 성공!');
        login(response.data.name, response.data.userCode, response.data.role, response.data.id);  // 로그인 상태 업데이트
        navigate('/', { state: { userData: response.data } });
      } else {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
        setuserCode('');
        setPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
      } else {
        console.error("Login error:", error);
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="login_container">
      <div className="login_box">
        <h2>LOGIN</h2>
        <img src="/Logo.png" className="logo_login"/>
        <form onSubmit={handleSubmit}>
          <div className="input_group">
            <input
              type="text"
              value={userCode}
              onChange={(e) => setuserCode(e.target.value)}  // setEmail로 email 상태 업데이트
              id="email"
              name="email"
              placeholder="아이디"
              required
            />
          </div>
          <div className="input_group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // setPassword로 password 상태 업데이트
              name="password"
              placeholder="비밀번호"
              required
            />
          </div>

          <button type="submit" className="login_button">로그인</button>
        </form>

        <div className="lost_id_pw">
          <a href="#lost_id_pw">아이디/비밀번호찾기</a>
          <hr />
          <a href="/Signup">회원가입</a>
        </div>

        <div className="sns_login">
          <label>다른 계정으로 <br /> 로그인하기</label>
          {/* 카카오 로그인 버튼 */}
          <a href={kakaoLoginUrl}>
            <img src={kakao} alt="카카오 로그인" className="kakao_img" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
