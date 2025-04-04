import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Category.css';

const Category = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/items/list')
            .then((response) => {
                const filteredProducts = response.data.filter((product) => {
                    if (category === '구이류') return product.category === 'ROAST';
                    if (category === '국물 요리') return product.category === 'SOUP';
                    if (category === '파스타') return product.category === 'PASTA';
                    if (category === '안주') return product.category === 'ANJU';
                    return true;
                });
                setProducts(filteredProducts);
                setCurrentPage(1); // 새 카테고리 선택 시 첫 페이지로 리셋
                setLoading(false);
            })
            .catch((error) => {
                console.error("에러", error);
                setLoading(false);
            });
    }, [category]);

    // 페이지별로 잘라내기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className="Category">
            <h1>상품 목록</h1>
            <h2>{category} 카테고리</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p className="no-products">해당 카테고리에 속하는 상품이 없습니다.</p>
                    ) : (
                        <>
                            <ul className="products">
                                {currentItems.map((product) => (
                                    <li key={product.id}>
                                        <h2>{product.name}</h2>
                                        <img src={product.image} alt={product.name} />
                                        <p>{product.content}</p>
                                        <p>Price: {product.price}원</p>
                                        <Link to={`/detail/${product.id}`} state={product}>
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
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Category;
