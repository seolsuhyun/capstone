import React from 'react';
import './Home.css';
import data from './data.js';
import { Link } from "react-router-dom"; 
const Home = () => {
  return (
    
    <div className='home'>
    <h1>상품 목록</h1>
    <ul className='products'>
        {data.map((item) => (
          <li key={item.id} style={{ marginBottom: '20px' }}>
            <h2>{item.title}</h2>
            <img 
              src={item.image} 
              alt={item.title} 
            />
            <p>{item.content}</p>
            <p>가격: {item.price.toLocaleString()} 원</p>
           
            <br />
       
            <Link to={`/detail/${item.id}`}>상품 상세 보기</Link>
          </li>
        ))}
      </ul>
  </div>
  );
};

export default Home;