import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Header/>
    <App/>
    <Footer/>
  </>
);

