// src/Popup/AIBubble.jsx
import React from 'react';
import './AIBubble.css';

const AIBubble = ({ onClick }) => {
  return (
    <div className="ai-bubble" onClick={onClick}>
      💬 무엇이든 물어보세요!
    </div>
  );
};

export default AIBubble;
