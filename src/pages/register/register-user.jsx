import { Form, Input, Button } from 'antd';
import { registerUser } from '../../api/user';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getPasswordStrength } from '../../utils/util';

function Register() {
    const STORAGE_KEY = 'jwtToken';
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '#d9d9d9' });

    const handlePasswordChange = (event) => {
        const nextPassword = event.target.value;
        setPassword(nextPassword);
        setPasswordStrength(getPasswordStrength(nextPassword));
    };

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
                        <Form.Item
                            layout="vertical"
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 8, message: 'Password must be at least 8 characters!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const strength = getPasswordStrength(value || '');
                                        if (!value || strength.score >= 3) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Use a stronger password with uppercase letters, numbers, or symbols.'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Password" value={password} onChange={handlePasswordChange} />
                        </Form.Item>
                        {password && (
                            <div style={{ marginTop: -8, marginBottom: 16 }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            style={{
                                                flex: 1,
                                                height: 4,
                                                borderRadius: 2,
                                                background: item <= passwordStrength.score ? passwordStrength.color : '#f0f0f0',
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ fontSize: 12, color: passwordStrength.color, marginTop: 4 }}>
                                    {passwordStrength.label || 'Add more complexity'}
                                </div>
                            </div>
                        )}
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