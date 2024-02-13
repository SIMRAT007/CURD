import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const userId = process.env.REACT_APP_USER_ID;
    const userPassword = process.env.REACT_APP_PASSWORD;

    if (email === userId && password === userPassword) {
      // Redirect to dashboard upon successful login
      window.location.href = '/dashboard';
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </div>
  );
};

export default LoginPage;
