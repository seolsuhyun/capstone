import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer'; // Footer 컴포넌트가 없다면 생략 가능

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
     <Footer /> 
  </>
);

export default MainLayout;
