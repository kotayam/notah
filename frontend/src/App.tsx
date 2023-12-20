import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./Landing"
import Home from "./Notah.tsx";
import Login from "./Login.tsx";
import CreateAccount from "./CreateAccount.tsx";
import NotFound from "./NotFound.tsx";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/note" element={<Home/>}/>
      <Route path="/note/:username" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<CreateAccount/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    
    </>
  )
}

export default App;
