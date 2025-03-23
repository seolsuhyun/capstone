import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 라우트가 변경될 때마다 스크롤을 맨 위로 이동
  }, [location]);

  return null;
};

export default ScrollToTop;
