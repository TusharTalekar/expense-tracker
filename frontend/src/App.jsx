import {
  BrowserRouter as Router, Routes, Route, Navigate,
  Form
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";




const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App;

const Root = () => {
  // if token in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // redirect to dashboard if login else login 
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};