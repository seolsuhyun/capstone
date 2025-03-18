import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupOk.css";

const SignupOk = () => {
  const [userName, setUserName] = useState("고객님");
  const navigate = useNavigate();

  useEffect(() => {
    // 회원가입 시 저장된 이름 가져오기
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div className="SignupOk">
      <h2>회원 가입</h2>
      <div className="SignupOk-cnt">
        <h1>{userName} 고객님</h1>
        <img
          src="https://i.imgur.com/q6fF9iD.png" // 웃는 사진 URL (변경 가능)
          alt="Smile"
          className="smile-image"
        />
        <h2>회원가입을 진심으로 환영합니다!</h2>
        <button onClick={() => navigate("/login")} className="login-button">
          로그인 페이지로 가기
        </button>
      </div>
    </div>
  );
};

export default SignupOk;
