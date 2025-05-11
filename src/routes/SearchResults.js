import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './SearchResults.css';
import { Link } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];

  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);  // 로딩 상태

  // 전체 상품 불러오기
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/items/list');
        console.log("📥 전체 상품:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('❌ 상품 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 추천된 이름과 일치하는 상품 필터링
  useEffect(() => {
    if (products.length > 0 && recommendations.length > 0) {
      const matchedItems = products.filter(item =>
        recommendations.some(reco => {
          const productName = item.name?.toLowerCase().trim();
          const recoName = reco.name?.toLowerCase().trim();
          return productName === recoName;
        })
      );
      setFilteredItems(matchedItems);
    }
  }, [products, recommendations]);

  return (
    <div className="search-results-container">
      <h2>추천 검색 결과</h2>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : filteredItems.length === 0 ? (
        <p>해당 이름의 상품이 없습니다.</p>
      ) : (
        <ul className="search-results-list">
          {filteredItems.map((item, index) => (
            <li key={index} className="search-result-item">
              <h3>{item.name}</h3>
              <p>{item.content}</p>
              <p>Price: {item.price}원</p>
              {item.image && (
                <img 
                  src={item.image.startsWith("/images/item/") 
                    ? `http://localhost:8080${item.image}` 
                    : item.image} 
                  alt={item.name} 
                  className="search-result-image" 
                />
              )}
              <Link to={`/detail/${item.id}`} state={item}>
                상품 상세 보기
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
