import React, { useState } from 'react';
import './AdminPage.css';
import UserManagement from './admin/UserManagement';
import ReturnProcessing from './admin/ReturnProcessing';
import ProductRegistration from './admin/ProductRegistration';
import ProductUpdate from './admin/ProductUpdate';
import ProductDelete from './admin/ProductDelete';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [productId, setProductId] = useState(null); // 수정과 삭제용 상품 ID

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserManagement />;
      case 'return':
        return <ReturnProcessing />;
      case 'product-registration':
        return <ProductRegistration />;
      case 'product-update':
        return <ProductUpdate productId={productId} />;
      case 'product-delete':
        return <ProductDelete />;
      default:
        return <p>관리자 기능을 선택하세요.</p>;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>관리자 페이지</h1>
      </header>
      <nav className="admin-sidebar">
        <ul>
          <li><button onClick={() => setActiveTab('user')}>회원 관리</button></li>
          <li><button onClick={() => setActiveTab('return')}>주문 처리</button></li>
          <li>
            <button onClick={() => setActiveTab('product-registration')}>상품 등록</button>
            <button onClick={() => setActiveTab('product-update')}>상품 수정</button>
            <button onClick={() => setActiveTab('product-delete')}>상품 삭제</button>
          </li>
        </ul>
      </nav>
      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPage;
