import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./Landing"
import NotahMemo from "./NotahMemo";
import Notah from "./Notah.tsx";
import AccountPage from "./AccountPage.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import NotFound from "./NotFound.tsx";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/memo" element={<NotahMemo/>}/>
      <Route path="/notah" element={<Notah/>}/>
      <Route path="/account" element={<AccountPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    
    </>
  )
}

export default App;
