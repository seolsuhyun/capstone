import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManagement.css';

const ProductManagement = ({ onEditClick }) => {  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/items/list');
      setProducts(res.data);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    }
  };

  const deleteProduct = async (id, name) => {
    const confirmDelete = window.confirm(`${name} 상품을 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/admin/item/${id}/delete`);
      setProducts(products.filter((product) => product.id !== id));
      alert('상품 삭제 성공!');
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('삭제 중 오류 발생');
    }
  };

  return (
    <div className="product-delete-page">
      <h2>상품 관리</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>상품명</th>
            <th>가격</th>
            <th>재고</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}원</td>
              <td>{product.stock}</td>
              <td>
                {/* 수정 버튼 클릭 시 해당 상품의 ID만 넘김 */}
                <button onClick={() => onEditClick(product.id)}>수정</button>
                <button onClick={() => deleteProduct(product.id, product.name)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
