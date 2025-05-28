import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import './ProductUpdate.css';

const ProductUpdate = ({ product }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    content: '',
    subcontent: '',       // ← 추가
    stock: '',
    itemStatus: 'NEW',
    category: 'SOUP',
    subCategory: 'TANG',
    itemImgIds: [],
  });

  const [images, setImages] = useState([]);

  // productId 추출
  const { id: productId } = product || {};

  // product가 변경될 때 form 상태 초기화
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        content: product.content || '',
        subcontent: product.subcontent || '',  // ← 추가
        stock: product.stock || '',
        itemStatus: product.itemStatus || 'NEW',
        category: product.category || 'SOUP',
        subCategory: product.subCategory || 'TANG',
        itemImgIds: product.itemImgIds || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('상품 수정 실패: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="product-update-container">
      <h2 className="title">상품 수정</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          className={classNames('input-field', 'product-id')}
          name="productId"
          value={productId || ''}
          readOnly
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
        <input
          className={classNames('input-field', 'product-description')}
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="상품 설명"
        />
        <textarea
          className={classNames('input-field', 'product-subcontent')}
          name="subcontent"
          value={form.subcontent}
          onChange={handleChange}
          placeholder="부가 설명 (subcontent)"
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
          <option value="DISC">DISCOUNT</option>
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
          <option value="JFOOD">JFood</option>
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
          <option value="FISH">Fish</option>
          <option value="FRIED">Fried</option>
          <option value="BOKKEUM">Bokkeum</option>
          <option value="SORBET">Sorbet</option>
          <option value="RAMEN">Ramen</option>
          <option value="REST">Rest</option>
          <option value="NABE">Nabe</option>
          <option value="JFRIED">JFried</option>
          <option value="SUSHI">Sushi</option>
          <option value="GRILL">Grill</option>
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
