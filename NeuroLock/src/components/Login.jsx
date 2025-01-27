import React from 'react';

const LoginPage = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return (
        <div className="login-page">
            <button onClick={handleGoogleLogin} className="google-login-btn">
                Login with Google
            </button>
        </div>
    );
};

export default LoginPage;
