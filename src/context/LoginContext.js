// LoginContext.js
import React, { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태
  const [userName, setUserName] = useState('');  // 사용자 이름 상태
const [userCode, setUserCode] = useState(''); // 사용자 코드 상태 추가
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const[userGrade, setUserGrade]=useState(''); // 사용자 이메일 상태 추가

  const login = (name, usercode,role,id,grade) => {
    console.log("로그인 실행! 아이디:", usercode, "이름:", name,"Role",role,"id:",id,"grade:",grade);
    setIsLoggedIn(true);
    setUserId(id);
    setUserName(name);
    setUserCode(usercode);
    setUserRole(role);
    setUserGrade(grade); // 로그인 시 이메일도 설정
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(''); 
    setUserName('');  
    setUserCode('');  // 로그아웃 시 사용자 코드 초기화
    setUserRole('');
    setUserGrade('');  // 로그아웃 시 이메일 초기화
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout, userName, userCode,userRole,userId,userGrade }}>
      {children}
    </LoginContext.Provider>
  );
};
