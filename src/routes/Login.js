import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLogin } from "../context/LoginContext";  // useLogin 훅을 import
import "./Login.css";
import kakao from "./kakaoImg.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useLogin();  // 로그인 상태를 변경하는 함수
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('email', email); 
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
        console.log('유저 이메일: ' + response.data.email);
        console.log('권한: ' + response.data.authorities);
        login(response.data.name,response.data.email,response.data.role);
        navigate('/', { state: { userData: response.data } });
      } else {
        // 로그인 실패 시 오류 메시지
        alert('아이디 또는 비밀번호가 틀렸습니다.');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      // 서버 오류 처리
      console.error("Login error:", error);
      alert('서버에 문제가 발생했습니다. 다시 시도해주세요.');
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // setEmail로 email 상태 업데이트
              id="email"
              name="email"
              placeholder="이메일"
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
          <img src={kakao} alt="kakao" className="kakao_img" />
        </div>
      </div>
    </div>
  );
};

export default Login;
