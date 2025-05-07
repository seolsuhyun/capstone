import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import UserManagement from './admin/UserManagement';
import ReturnProcessing from './admin/ReturnProcessing';
import ProductRegistration from './admin/ProductRegistration';
import ProductUpdate from './admin/ProductUpdate';
import ProductDelete from './admin/ProductDelete';
import ProductManagement from './admin/ProductManagement';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [productId, setProductId] = useState(null);  // 수정할 상품의 ID
  const navigate = useNavigate();  // useNavigate 훅 사용

  // onEditClick 핸들러: 수정 버튼 클릭 시 해당 상품 ID로 tab 변경
  const handleEditClick = (id) => {
    setProductId(id);
    setActiveTab('product-update');  // 해당 탭으로 전환
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserManagement />;
      case 'return':
        return <ReturnProcessing />;
      case 'product-registration':
        return <ProductRegistration />;
      case 'product-update':
        return <ProductUpdate productId={productId} />;  // 넘긴 productId로 수정
      case 'product-management':
        return <ProductManagement onEditClick={handleEditClick} />;
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
          <li><button onClick={() => setActiveTab('product-registration')}>상품 등록</button></li>
          <li><button onClick={() => setActiveTab('product-management')}>상품 관리</button></li>
        </ul>
      </nav>
      <main className="admin-main">
        {renderContent()}
      </main>
      <footer className="admin-footer">
        <button onClick={() => navigate('/')}>메인 페이지로 돌아가기</button> {/* 메인 페이지로 이동하는 버튼 */}
      </footer>
    </div>
  );
};

export default AdminPage;
