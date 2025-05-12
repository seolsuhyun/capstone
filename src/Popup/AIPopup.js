// components/AIPopup.js
import React from 'react';
import './AIPopup.css';

const AIPopup = ({ onClose }) => {
  return (
    <div className="ai-popup-overlay">
      <div className="ai-popup">
        <button className="ai-popup-close" onClick={onClose}>×</button>
        <h2>AI 검색창 오픈 🎉</h2>
        <p>AI를 통해 추천 상품을 볼수있습니다. 검색창에서 검색해보세요 😊</p>
    
      </div>
    </div>
  );
};

export default AIPopup;
