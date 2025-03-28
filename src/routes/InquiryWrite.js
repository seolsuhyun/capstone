import React, { useState } from 'react';
import './InquiryWrite.css';

const InquiryWrite = () => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 제출 시 처리할 로직 (예: API 호출)
    console.log('문의 내용 제출:', formData);
  };

  return (
    <div className="inquiry-write">
      <h2>1:1 문의 하기</h2>
      <p>고객님들의 질문을 작성해주세요</p>
      <div className='inquiry-write-cnt'>
      <form onSubmit={handleSubmit}>
        <h2>1:1 문의하기</h2>
        <div className="inquiry-write__form-group">
          <label htmlFor="inquiryType">문의 유형</label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="general">일반 문의</option>
            <option value="technical">기술 지원</option>
            <option value="billing">결제 관련</option>
          </select>
        </div>

        <div className="inquiry-write__form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder='제목을 입력해주세요'
            required
          />
        </div>

        <div className="inquiry-write__form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder='내용을 입력해주세요'
            required
          />
        </div>

        <button type="submit" className="inquiry-write__submit-btn">제출</button>
      </form>
      </div>
    </div>
  );
};

export default InquiryWrite;
