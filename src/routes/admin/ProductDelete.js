import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames'; // classnames 라이브러리 import
import './ProductDelete.css'; // 삭제 페이지 CSS

const ProductDelete = () => {
  const [productId, setProductId] = useState('');

  const handleChange = (e) => {
    setProductId(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.delete(`/admin/item/${productId}/delete`);
      alert('상품 삭제 성공!');
    } catch (error) {
      console.error(error);
      alert('상품 삭제 실패: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="product-delete-container">
      <input
        className={classNames('input-field', 'delete-input')}
        type="text"
        value={productId}
        onChange={handleChange}
        placeholder="삭제할 상품 ID 입력"
      />
      <button
        className={classNames('submit-btn', 'product-delete-btn')}
        onClick={handleSubmit}
      >
        상품 삭제
      </button>
    </div>
  );
};

export default ProductDelete;
