import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from './authLayout'
import HomePage from './pages/home'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { getUserProfile } from './api/user';
import { SetUser } from './redux/userslice';
import GroupDetailPage from './pages/groups/GroupDetailPage';
import GroupsPage from './pages/groups/GroupsPage';
import './App.css'

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await getUserProfile();
        dispatch(
          SetUser({
            userId: response.id,
            userName: response.username,
          })
        );
        console.log("User profile fetched successfully");
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        localStorage.removeItem("token");
        navigate('/login');
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/*" element={<AuthLayout />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailPage />} />
      </Routes>
    </>
  )
}

export default App
