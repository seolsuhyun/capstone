import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReturnProcessing.css'; // CSS 파일 import

const ReturnProcessing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/orders')
      .then(response => {
        console.log('주문 내역:', response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('주문 내역 불러오기 실패:', error);
        setLoading(false);
      });
  }, []);

  // 배송 상태 변경 요청
  const handleDeliveryUpdate = (orderId, type) => {
    const endpoint =
      type === 'go' ? `/admin/${orderId}/ordergo` : `/admin/${orderId}/orderdone`;

    axios.post(endpoint)
      .then(() => {
        alert(`배송 ${type === 'go' ? '시작' : '완료'} 처리되었습니다.`);
        // 상태 새로고침
        return axios.get('/admin/orders');
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('배송 상태 변경 실패:', error);
        alert('오류가 발생했습니다.');
      });
  };

  // 반품 처리 요청
  const handleReturnRequest = (orderId) => {
    axios.post(`/admin/${orderId}/return`)
      .then(() => {
        alert('반품 요청이 처리되었습니다.');
        // 상태 새로고침
        return axios.get('/admin/orders');
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('반품 처리 실패:', error);
        alert('오류가 발생했습니다.');
      });
  };

  return (
    <div className="returnprocessing">
      <h2>주문 처리</h2>
      <p>반품 신청 내역을 확인하고 처리할 수 있습니다.</p>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="returnprocessing-order-list">
          {orders.map((order) => (
            <div key={order.orderId} className="returnprocessing-order-card">
              <h3>주문번호: {order.orderId}</h3>
              <p>주문일자: {order.orderDate}</p>
              <p>주문 상태: {order.delivery}</p>
              <p>회원 ID: {order.memberId}</p>
              <div className="returnprocessing-button-group">
                <button
                  className={`returnprocessing-delivery-button ${order.delivery !== 'NOT' ? 'returnprocessing-button-disabled' : ''}`}
                  onClick={() => handleDeliveryUpdate(order.orderId, 'go')}
                  disabled={order.delivery !== 'NOT'}
                >
                  배송 시작
                </button>
                <button
                  className={`returnprocessing-delivery-button ${order.delivery !== 'GO' ? 'returnprocessing-button-disabled' : ''}`}
                  onClick={() => handleDeliveryUpdate(order.orderId, 'done')}
                  disabled={order.delivery !== 'GO'}
                >
                  배송 완료
                </button>
                {/* 반품하기 버튼 */}
                <button
                  className="returnprocessing-return-button"
                  onClick={() => handleReturnRequest(order.orderId)}
                  disabled={order.delivery === 'RETURN'} // 반품 완료된 주문은 반품할 수 없음
                >
                  반품하기
                </button>
              </div>
              <h4>주문 상품</h4>
              <table className="returnprocessing-order-table">
                <thead>
                  <tr>
                    <th>이미지</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>단가</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItemDtoList.map((item) => (
                    <tr key={item.itemId}>
                      <td>
                        <img src={item.image} alt={item.name} className="returnprocessing-product-image" />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.count}</td>
                      <td>{item.price.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReturnProcessing;
