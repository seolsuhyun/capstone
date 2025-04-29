import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./Category.css"; // ✅ 기존 스타일 그대로 적용

const SubCategoryPage = () => {
    const { subcategory } = useParams();  // 🔧 'category' → 'subcategory'로 수정
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 🔤 영문 → 한글 변환용 맵핑 함수
    const getSubcategoryName = (code) => {
        switch (code) {
            case 'FRIED': return '튀김류';
            case 'BOKKEUM': return '볶음류';
            case 'SUSHI': return '초밥';
            case 'JJIGAE': return '국/찌개';
            case 'TANG': return '탕류';
            case 'Noodle': return '파스타';
            case 'SORBET': return '샤베트';
            default: return code;
        }
    };

    useEffect(() => {
        setLoading(true);
        console.log("현재 URL에서 넘어온 subcategory:", subcategory);
        axios.get('http://localhost:8080/items/list')
            .then((response) => {
                console.log(response.data.map(p => ({ name: p.name, subCategory: p.subCategory })));
                const filteredProducts = response.data.filter((product) => {
                    return product.subCategory === subcategory;
                });

                setProducts(filteredProducts);
                setCurrentPage(1); // 새 카테고리 선택 시 첫 페이지로 리셋
                setLoading(false);
            })
            .catch((error) => {
                console.error("에러", error);
                setLoading(false);
            });
    }, [subcategory]);

    // 페이지별로 잘라내기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className="Category">
            <h1>상품 목록</h1>
            <h2>{getSubcategoryName(subcategory)} 카테고리</h2>
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
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="page-btn"
                                >
                                    «
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

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

export default SubCategoryPage;

