import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:8080/items/list")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("에러", error);
      });
  }, []);


  // 현재 페이지에 맞는 상품 목록 자르기
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="home">
      <h1>상품 목록</h1>
      <ul className="products">
        {currentItems.map((product) => {
          const imageUrl =
            product.image && product.image.startsWith("/images/item/")
              ? `http://localhost:8080${product.image}`
              : product.image; // 이미지 경로가 null이 아니면 절대 경로로 설정

          return (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <img src={imageUrl} alt={product.name} />
              <p>{product.content}</p>
              <p>Price: {product.price}원</p>
              <Link to={`/detail/${product.id}`} state={product}>
                상품 상세 보기
              </Link>
           
            </li>
          );
        })}
      </ul>

      {/* 페이지네이션 */}
      <div className="pagination">
        {/* 맨 앞으로 가기 버튼 */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="page-btn"
        >
          «
        </button>

        {/* 페이지 번호 버튼 */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}

        {/* 맨 뒤로 가기 버튼 */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Home;
