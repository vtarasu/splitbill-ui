import { Form, Input, Button } from 'antd';
import { registerUser } from '../../api/user';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Register() {
    const STORAGE_KEY = 'jwtToken';
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = async (values) => {
        try {
            const response = await registerUser(values);
            if (response.errorMessage) {
                setErrorMessage(response.errorMessage);
                return;
            }
            const token = response.token;
            localStorage.setItem(STORAGE_KEY, token);
            console.log('Registration successful, JWT token stored in localStorage');
            setErrorMessage('');
            navigate('/home');
        } catch (error) {
            setErrorMessage('Error registering. Please try again.');
        }
    }

    return (
        <>
            <main>
                <h1>Register</h1>
                <section>
                    <Form layout="vertical" name="register" onFinish={onFinish}>
                        <Form.Item layout="vertical" label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                            <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item layout="vertical" label="Email" name="emailId" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item layout="vertical" label="Mobile Number" name="mobileNumber" rules={[{ required: true, message: 'Please input your mobile number!' }]}>
                            <Input placeholder="Mobile Number" />
                        </Form.Item>
                        <Form.Item layout="vertical" label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input type={'password'} placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Register</Button>
                        </Form.Item>
                    </Form>
                    {errorMessage && (
                        <div style={{ color: 'red' }}>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    <div>
                        <p>
                            Already have an account? <Link to="/login">Login Here</Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Register;