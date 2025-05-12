import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

function SearchResults() {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/items/list`, {
          params: { search: searchTerm }
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchTerm) {
      fetchItems();
    }
  }, [searchTerm]);

  return (
    <div className="search-results-container">
      <h2>검색 결과: "{searchTerm}"</h2>
      {items.length > 0 ? (
        <ul className="search-results-list">
          {items.map((item) => (
            <li key={item.id} className="search-results-item">
              <h2>{item.name}</h2>
              <img src={item.image} alt={item.name} className="search-results-image" />
              <p>{item.content}</p>
              <p>Price: {item.price}원</p>
              <Link to={`/detail/${item.id}`} state={item} className="search-results-detail-link">
                상품 상세 보기
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default SearchResults;