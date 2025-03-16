import React, { createContext, useState, useContext } from 'react';

// 로그인 상태와 상태 업데이트 함수 제공
const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);  // 로그인 상태를 사용하는 훅
};

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // 로그인 상태 업데이트 함수
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
