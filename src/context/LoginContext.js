// LoginContext.js
import React, { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태
  const [userName, setUserName] = useState('');  // 사용자 이름 상태
  const [userEmail, setUserEmail] = useState(''); // 사용자 이메일 상태 추가

  const login = (name, email) => {
    console.log("로그인 실행! 이메일:", email, "이름:", name);
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);  // 로그인 시 이메일도 설정
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');  
    setUserEmail('');  // 로그아웃 시 이메일 초기화
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout, userName, userEmail }}>
      {children}
    </LoginContext.Provider>
  );
};
