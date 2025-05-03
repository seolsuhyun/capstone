import React, { useState } from 'react';
import './AdminPage.css';
import UserManagement from './admin/UserManagement';
import ReturnProcessing from './admin/ReturnProcessing';
import ProductRegistration from './admin/ProductRegistration';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('user');

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserManagement />;
      case 'return':
        return <ReturnProcessing />;
      case 'product':
        return <ProductRegistration />;
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
          <li><button onClick={() => setActiveTab('product')}>상품 등록</button></li>
        </ul>
      </nav>
      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPage;
