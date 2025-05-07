import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 'code' 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 백엔드에 'code' 전송하여 로그인 처리
      axios.post('http://localhost:8080/oauth/login/callback', { code })
        .then((response) => {
          // 로그인 성공 시 메인 페이지로 리다이렉트
          navigate('/');
        })
        .catch((error) => {
          console.error("Login error:", error);
          alert('로그인 중 오류가 발생했습니다.');
        });
    }
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
