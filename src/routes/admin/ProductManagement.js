import React, { useState } from 'react';
import ProductRegistration from './ProductRegistration';
import ProductUpdate from './ProductUpdate';
import ProductDelete from './ProductDelete';

const ProductManagement = () => {
  const [selectedTab, setSelectedTab] = useState('register'); // 기본 탭은 상품 등록

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="product-management">
      <h2>상품 관리</h2>
      
      <div className="tabs">
        <button onClick={() => handleTabChange('register')}>상품 등록</button>
        <button onClick={() => handleTabChange('update')}>상품 수정</button>
        <button onClick={() => handleTabChange('delete')}>상품 삭제</button>
      </div>

      <div className="tab-content">
        {selectedTab === 'register' && <ProductRegistration />}
        {selectedTab === 'update' && <ProductUpdate />}
        {selectedTab === 'delete' && <ProductDelete />}
      </div>
    </div>
  );
};

export default ProductManagement;
