import React, { useState } from 'react';
import axios from 'axios';
import './InquiryWrite.css';
import { useNavigate } from 'react-router-dom';

const InquiryWrite = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inquiryData = {
      title: formData.title,
      content: formData.content,
    };

    try {
      // POST 요청 보내기 (세션 쿠키를 자동으로 포함)
      const response = await axios.post('http://localhost:8080/boards/write', inquiryData, {
        withCredentials: true, // 세션 쿠키를 자동으로 전송하도록 설정
       
      });

      // 성공적인 응답 처리
      console.log('Board created:', response.data);
      alert('문의가 성공적으로 제출되었습니다!');
      navigate('/Q&A');
    } catch (error) {
      // 에러 처리
      console.error('Error creating inquiry:', error);
      alert('문의 제출에 실패했습니다.');
    }
  };

  return (
    <div className="inquiry-write">
      <h2>1:1 문의 하기</h2>
      <p>고객님들의 질문을 작성해주세요</p>
      <div className="inquiry-write-cnt">
        <form onSubmit={handleSubmit}>
          <h2>1:1 문의하기</h2>

          <div className="inquiry-write__form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력해주세요"
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
              placeholder="내용을 입력해주세요"
              required
            />
          </div>

          <button type="submit" className="inquiry-write__submit-btn">
            제출
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryWrite;
