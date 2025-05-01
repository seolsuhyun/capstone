import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [members, setMembers] = useState([]);

  // 회원 목록 조회
  useEffect(() => {
    axios.get('/admin/members')
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.error('회원 목록을 불러오는 중 오류 발생:', error);
      });
  }, []);

  // 회원 삭제 함수
// 회원 삭제 함수
const deleteMember = (id, name) => {
  // 삭제 확인 팝업
  const confirmDelete = window.confirm(`${name} 회원을 삭제하시겠습니까?`);
  if (!confirmDelete) return;  // 취소 클릭 시 삭제하지 않음

  axios.post(`/admin/${id}/deleteMember`)  // 경로 수정
    .then(() => {
      // 삭제 후 회원 목록 새로고침
      setMembers(members.filter((member) => member.id !== id));
      alert('회원이 삭제되었습니다.');
    })
    .catch((error) => {
      console.error('회원 삭제 오류:', error);
      alert('회원 삭제에 실패했습니다.');
    });
};



  return (
    <div className="user-management">
      <h2>회원 관리</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>이름</th>
            <th>역할</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.email}</td>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>
  <button onClick={() => deleteMember(member.id, member.name)}>삭제</button>
</td>


            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
