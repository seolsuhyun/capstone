import { Route, Routes } from "react-router-dom";
import Location from "./routes/Location";
import Home from "./routes/Home";
import Login from "./routes/Login";
import './App.css';
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
import MainPage from "./Layout/MainPage";
function App() {

    
  return (

    <Routes>
     
      <Route path="/" element={<Home/>} />
      <Route path="/Location" element={<Location />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/order" element={<Order />} />
      <Route path="/Signup/SignupOk" element={<SignupOk/>}/>
      <Route path="Mypage" element={<Mypage/>}/>
      <Route path="/order/ordersuccess" element={<OrderSuccess/>}/>
      <Route path="/category/:category" element={<Category />} />
      <Route path="/FaQ" element={<FaQ/>}/>
      <Route path="/Q&A" element={<QAPage />} />
      <Route path="/Q&A/BoardWrite" element={<InquiryWrite/>}/>
      <Route path="/Q&A/content/:questionId" element={<QAContent />} />
      <Route path="/Q&A/modify/:questionId" element={<QAModify />} />
    </Routes>

  );
}

export default App;