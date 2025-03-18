// LoginContext.js
import React, { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태
  const [userName, setUserName] = useState('');  // 사용자 이름 상태

  const login = (name) => {
    setIsLoggedIn(true);
    setUserName(name);  // 로그인 시 사용자 이름 설정
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');  // 로그아웃 시 사용자 이름 초기화
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout, userName }}>
      {children}
    </LoginContext.Provider>
  );
};
