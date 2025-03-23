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


function App() {

    
  return (

    <Routes>
     
      <Route path="/" element={<Home />} />
      <Route path="/Location" element={<Location />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/order" element={<Order />} />
      <Route path="/Signup/SignupOk" element={<SignupOk/>}/>
      <Route path="Mypage" element={<Mypage/>}/>
      <Route path="/order/ordersuccess" element={<OrderSuccess/>}/>

    </Routes>

  );
}

export default App;