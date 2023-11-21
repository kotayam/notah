import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import CreateAccount from "./CreateAccount.tsx";
import NotFound from "./NotFound.tsx";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home access={"guest"}/>}/>
      <Route path="/:id" element={<Home access={"user"}/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/create-account" element={<CreateAccount/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    
    </>
  )
}

export default App;
