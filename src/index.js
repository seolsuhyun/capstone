import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import { BrowserRouter } from 'react-router-dom';
import { LoginProvider } from './context/LoginContext';
import ScrollToTop from './ScrollToTop';  // ScrollToTop 컴포넌트 import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <LoginProvider>
      <Header />
      <ScrollToTop /> 
      <App />
      <Footer />
    </LoginProvider>
  </BrowserRouter>
);
