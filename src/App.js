import {Route, Routes} from "react-router-dom";
import Location from "./routes/Location";
import Home from "./routes/Home";
import Login from "./routes/Login";
import './App.css';
import Signup from "./routes/Signup";
function App() {
  return (
   
   <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/Location" element={<Location />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Signup" element={<Signup/>} />
    </Routes>
  
  );
}

export default App;