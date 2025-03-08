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
              <a href="/Info" className="footer-link">
                브랜드 소개
              </a>
            </li>
            <li>
              <a href="/Location" className="footer-link">
                오는 길
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-content">
          <h3>고객 서비스</h3>
        <hr/>
          <ul className='footer-ul'>
            <li >
              <a href="#brand-info" className="footer-link">
                주문 배송 조회
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                반품 신청
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                배송 서비스
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                FAQ
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                고객 문의
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-content">
          <h3>제품 목록</h3>
        <hr/>
          <ul className='footer-ul'>
            <li >
              <a href="#brand-info" className="footer-link">
                밀키트
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                신상품
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                베스트
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
                세일
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-content">
          <h3>소셜 미디어</h3>
        <hr/>
          <ul className='footer-ul'>
            <li >
              <a href="#brand-info" className="footer-link">
              Instagram
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
              Facebook
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
              Youtube
              </a>
            </li>
            <li>
              <a href="#location" className="footer-link">
               Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
      <h1 className="footer-email">  1971435@hansung.ac.kr 010-1234-1234</h1> 
      </div>
    </footer>

  );
};

export default Footer