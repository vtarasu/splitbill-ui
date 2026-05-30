import Login from './pages/login/login-user';
import Register from './pages/register/register-user';
import { Routes, Route } from 'react-router-dom';

function AuthLayout() {
    return (
        <>
            <div style={{ display: 'flex' }}>
                <div className="left-col">
                    <h1>Split Your Bill</h1>
                    <p>Track shared expenses and balances easily.</p>
                </div>
                <div className="right-col">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default AuthLayout;