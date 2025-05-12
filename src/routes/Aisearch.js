import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Aisearch.css';
import { Link } from 'react-router-dom';

const Aisearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 전체 상품 리스트를 처음 로드할 때 받아옴
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:8080/items/list');
                setProducts(res.data);
            } catch (err) {
                console.error('상품 리스트 요청 실패:', err);
            }
        };
        fetchProducts();
    }, []);

    // 추천 목록이 변경될 때마다 필터링
    useEffect(() => {
        if (products.length > 0 && recommendations.length > 0) {
            // 추천 결과에 description을 상품에 추가
            const productsWithDescription = products.map(product => {
                // 추천된 이름과 매칭되는 상품이 있으면 description을 추가
                const recommendedProduct = recommendations.find(
                    reco => reco.name?.trim().toLowerCase() === product.name?.trim().toLowerCase()
                );
                return recommendedProduct
                    ? { ...product, description: recommendedProduct.description }
                    : product;
            });

            // 필터링
            const matched = productsWithDescription.filter(product =>
                recommendations.some(reco => product.name?.trim().toLowerCase() === reco.name?.trim().toLowerCase())
            );

            setFilteredItems(matched);
        }
    }, [recommendations, products]);

    const fetchAiRecommendations = async (foodName) => {
        try {
            const response = await axios.post('http://localhost:8080/ai/chat', null, {
                params: { food: foodName },
            });
            return response.data.results || [];
        } catch (error) {
            console.error('AI 검색 실패:', error);
            return [];
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await fetchAiRecommendations(searchTerm);
        setRecommendations(result);
    };

    // 현재 페이지에 맞는 상품 목록 자르기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <div className="ai-search">
            <form onSubmit={onSubmit} className="ai-search-form">
                <div className="ai-search-label">검색창에 입력해주세요</div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="부기푸드"
                        className="ai-search-bar"
                    />
                    <button type="submit" className="ai-search-btn">
                        <img src="reading-glasses.png" alt="Search" className="ai-search-img" />
                    </button>
                </div>
            </form>

            {/* 검색 결과 */}
            {currentItems.length > 0 && (
                <div className="search-results">
                    <h3>추천된 상품</h3>
                    <ul className="products">
                        {currentItems.map((item, idx) => (
                            <li key={idx} className="search-result-item">
                                <h4>{item.name}</h4>
                                {item.image && (
                                    <img
                                        src={item.image.startsWith("/images/item/")
                                            ? `http://localhost:8080${item.image}`
                                            : item.image}
                                        alt={item.name}
                                        className="search-result-image"
                                    />
                                )}
                                <p>{item.description}</p> {/* 추가된 description 표시 */}
                                <p>{item.price}원</p>
                                <Link to={`/detail/${item.id}`} state={item}>
                                    상품 상세 보기
                                </Link>
                            </li>
                        ))}
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
                                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
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
            )}
        </div>
    );
};

export default Aisearch;
