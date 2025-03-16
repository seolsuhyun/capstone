import './Signup.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  // axios 임포트 추가

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/join', user);
      alert('회원가입 완료');
      window.location.href = '/';
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