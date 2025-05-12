import { Route, Routes } from "react-router-dom";
import './App.css';
import axios from "axios";
import { CartProvider } from "./context/CartContext";

// 레이아웃
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";

// 페이지
import Home from "./routes/Home";
import MainPage from "./Layout/MainPage";
import Location from "./routes/Location";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Detail from "./routes/Details";
import Order from "./routes/Order";
import SignupOk from "./routes/SignupOk";
import Mypage from "./routes/Mypage";
import OrderSuccess from "./routes/OrderSuccess";
import Category from "./routes/Category";
import FaQ from "./routes/FaQ";
import QAPage from "./routes/QAPage";
import InquiryWrite from "./routes/InquiryWrite";
import QAContent from "./routes/QAContent";
import QAModify from "./routes/QAModify";
import SearchResults from "./routes/SearchResults";
import Cart from "./routes/Cart";
import Orders from "./routes/Orders";
import AdminPage from "./routes/AdminPage";
import SubCategoryPage from "./routes/SubCategoryPage";
import KakaoCallback from "./routes/KakaoCallback";
import Aisearch from "./routes/Aisearch";
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

function App() {
  return (
    <CartProvider>

      <Routes>

        {/* 일반 사용자용 레이아웃 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/all" element={<Home />} />
          <Route path="/Location" element={<Location />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/order" element={<Order />} />
          <Route path="/Signup/SignupOk" element={<SignupOk />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/order/ordersuccess" element={<OrderSuccess />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/FaQ" element={<FaQ />} />
          <Route path="/Q&A" element={<QAPage />} />
          <Route path="/Q&A/BoardWrite" element={<InquiryWrite />} />
          <Route path="/Q&A/content/:questionId" element={<QAContent />} />
          <Route path="/Q&A/modify/:questionId" element={<QAModify />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/subcategory/:subcategory" element={<SubCategoryPage />} />
          <Route path="/oauth/login/callback" element={<KakaoCallback />} />
          <Route path="/Aisearch" element={<Aisearch/>} />
        </Route>

        {/* 관리자용 레이아웃 (헤더/푸터 없음) */}
        <Route element={<AdminLayout />}>
          <Route path="/Adminpage" element={<AdminPage />} />
        </Route>

      </Routes>

    </CartProvider>
  );
}

export default App;
