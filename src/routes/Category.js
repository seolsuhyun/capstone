import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Category.css';

const Category = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/items/list')
            .then((response) => {
                //카테고리별로 필터링
                const filteredProducts = response.data.filter((product) => {
                    if (category === '구이류') return product.category === 'ROAST';
                    if (category === '스프류') return product.category === 'SOUP';
                    if (category === '파스타류') return product.category === 'PASTA';
                    return true;  //아무 카테고리가 아니면 모든 제품
                });
                setProducts(filteredProducts);
                setLoading(false);
            })
            .catch((error) => {
                console.error("에러", error);
                setLoading(false);
            });
    }, [category]);

    return (
        <div className="Category">
            <h1>상품 목록</h1>
            <h2>{category} 카테고리</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p className="no-products">해당 카테고리에 속하는 상품이 없습니다.</p>  //상품이 없을 때
                    ) : (
                        <ul className="products">
                            {products.map((product) => (
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
                    )}
                </>
            )}
        </div>
    );
};

export default Category;