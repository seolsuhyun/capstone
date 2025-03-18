import './Signup.css';
import React, { useState } from 'react';
import axios from 'axios';  

import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(user.email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return; // 이메일이 유효하지 않으면 회원가입을 진행하지 않음
    }
    try {
      // 서버에 사용자 데이터 전송
      await axios.post('http://localhost:8080/join', user);
      alert('회원가입 완료');
      navigate("/Signup/SignupOk", { state: { userName: user.name } });
    } catch (error) {
      console.log('회원가입 에러: ' + error);
    }
  };
  

  return (
    <div className="Signup">
      <div className="Signup-text">회원가입</div>
      <form onSubmit={handleSubmit} className="Signup-form">
        <div className="form-group">
          회원 정보 입력
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <button type="submit" className="Signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
