import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import './ProductUpdate.css';

const ProductUpdate = ({ productId }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    content: '',
    stock: '',
    itemStatus: 'NEW',
    category: 'SOUP',
    subCategory: 'TANG',
    itemImgIds: [2], // <- 이걸 추가
  });
  
  const [images, setImages] = useState([]);

   // productId가 바뀔 때마다 데이터 새로 불러옴

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 필수: 폼 기본 동작 방지
  
    const formData = new FormData();
    formData.append(
      'itemFormDto',
      new Blob([JSON.stringify(form)], { type: 'application/json' })
    );
  
    if (images.length > 0) {
      images.forEach((file) => formData.append('itemImgFile', file));
    }
  
    try {
      const response = await axios.put(`/admin/item/${productId}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('상품 수정 성공! ID: ' + response.data);
      window.location.reload(); // 수정 후 새로고침
    } catch (error) {
      console.error(error);
      alert('상품 수정 실패: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="product-update-container">
      <h2 className="title">상품 수정</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        {/* ID는 자동으로 입력되는 필드로 수정 */}
        <input
          className={classNames('input-field', 'product-id')}
          name="productId"
          value={productId}
          readOnly // ID는 수정 불가능하게
        />
        <input
          className={classNames('input-field', 'product-name')}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="상품명"
        />
        <input
          className={classNames('input-field', 'product-price')}
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="가격"
          type="number"
        />
        <textarea
          className={classNames('input-field', 'product-description')}
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="상품 설명"
        />
        <input
          className={classNames('input-field', 'product-stock')}
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="재고"
          type="number"
        />
        <select
          className={classNames('input-field', 'product-status')}
          name="itemStatus"
          value={form.itemStatus}
          onChange={handleChange}
        >
          <option value="BEST">BEST</option>
          <option value="NEW">NEW</option>
        </select>

        <select
          className={classNames('input-field', 'product-category')}
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="SOUP">Soup</option>
          <option value="ROAST">Roast</option>
          <option value="PASTA">Pasta</option>
          <option value="ANJU">Anju</option>
        </select>

        <select
          className={classNames('input-field', 'product-subcategory')}
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
        >
          <option value="Noodle">Noodle</option>
          <option value="JJIGAE">Jjigae</option>
          <option value="TANG">Tang</option>
          <option value="SUSHI">Sushi</option>
          <option value="FRIED">Fried</option>
        </select>

        <input
          className={classNames('input-file')}
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <button type="submit" className={classNames('submit-btn', 'product-update-btn')}>
          상품 수정
        </button>
      </form>
    </div>
  );
};

export default ProductUpdate;
