import React, { useState, useEffect } from "react";
import './Home.css';
import axios from 'axios';
import { Link } from "react-router-dom"; 

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/items/list')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("에러", error);
      });
  }, []);

  return (
    <div className="home">
      <h1>상품 목록</h1>
      <ul className="products">
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} />
            <p>{product.content}</p>
            <p>Price: {product.price}원</p>
            <Link to={`/detail/${product.id}`} state={ product } >
              상품 상세 보기 
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
