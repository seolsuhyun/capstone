import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <hr />
      <div className="footer-content-wrapper">
        <div className="footer-content">
          <h3>부기 푸드</h3>
          <hr />
          <ul className='footer-ul'>
            
            <li>
              <a href="/Location" className="footer-link">
                오는 길
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-content">
          <h3>고객 서비스</h3>
          <hr />
          <ul className='footer-ul'>
           
            <li>
              <a href="/Q&A" className="footer-link">
                반품 신청
              </a>
            </li>
            <li>
              <a href="/FaQ" className="footer-link">
                FAQ
              </a>
            </li>
            <li>
              <a href="/Q&A" className="footer-link">
                고객 문의
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-content">
          <h3>제품 목록</h3>
          <hr />
          <ul className='footer-ul'>
            <li >
              <a href="/category/Best" className="footer-link">
                Best
              </a>
            </li>
            <li>
              <a href="/category/New" className="footer-link">
                New
              </a>
            </li>
            <li>
              <a href="/category/구이류" className="footer-link">
                구이/볶음
              </a>
            </li>
            <li>
              <a href="/category/국물요리" className="footer-link">
                국물요리
              </a>
            </li>
            <li>
              <a href="/category/면류" className="footer-link">
                면류
              </a>
            </li>
            <li>
              <a href="/category/일식" className="footer-link">
                일식
              </a>
            </li>
            <li>
              <a href="/category/안주" className="footer-link">
                안주
              </a>
            </li>
          </ul>
        </div>

       
      </div>
      <div>
      </div>
    </footer>

  );
};

export default Footer