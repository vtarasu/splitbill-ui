import { Form, Input, Button } from 'antd';
import { loginUser } from '../../api/user';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const STORAGE_KEY = 'jwtToken';
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const onfinish = async(values) => {
        try {
            const response = await loginUser(values);
            const token = response.token;
            localStorage.setItem(STORAGE_KEY, token);
            console.log('Login successful, JWT token stored in localStorage');
            setErrorMessage('');
            navigate('/home');
        } catch(error) {
            console.error('Error logging in:', error.message);
            setErrorMessage('Invalid username or password');
        }
    }
    return (
        <>
            <main>
                <h1>Login</h1>
                <section>
                    <Form layout="vertical" name="login" onFinish={onfinish}>
                        <Form.Item layout="vertical" label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                            <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item layout="vertical" label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input type={'password'} placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Login</Button>
                        </Form.Item>
                    </Form>
                    {errorMessage && (
                        <div style={{ color: 'red' }}>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    <div>
                        <p>
                            New User? <Link to="/register">Register Here</Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Login;