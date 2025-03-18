
import { useNavigate } from "react-router-dom";
import "./SignupOk.css";
import { useLocation } from 'react-router-dom';
const SignupOk = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = location.state || {};

  return (
    <div className="SignupOk">
      <h2>회원 가입</h2>
      <div className="SignupOk-cnt">
          <h2>환영합니다, {userName}님!</h2>
          <img src="https://cdn-icons-png.flaticon.com/512/3508/3508689.png"/>
        <h2>회원가입을 진심으로 환영합니다!</h2>
        <button onClick={() => navigate("/login")} className="login-button">
          로그인 페이지로 가기
        </button>
      </div>
    </div>
  );
};

export default SignupOk;
