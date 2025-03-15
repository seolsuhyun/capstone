import './Signup.css';
import React, { useState } from 'react';
import axios from 'axios';  // axios 임포트 추가

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    id: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 서버로 데이터를 전송하는 부분
    try {
      const response = await axios.post('api/join', {
        username: formData.username,
        email: formData.email,
        id: formData.id,
        password: formData.password,
      });

      // 서버가 응답하면 알림
      if (response.status === 200) {
        alert('회원가입이 완료되었습니다!');
        window.location.href = '/';  // 회원가입 후 홈 화면으로 이동
      }
    } catch (error) {
      console.error('회원가입 중 오류가 발생했습니다:', error);
      alert('서버와 연결 중 오류가 발생했습니다.');
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
          <label htmlFor="username">닉네임</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
