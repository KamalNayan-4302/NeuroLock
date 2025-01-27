import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'; // For navigation
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const navigate = useNavigate(); // Navigation instance
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login page if not authenticated
        } else {
            setIsAuthenticated(true);
            getPasswords();
        }
    }, []);

    const getPasswords = async () => {
        try {
            const req = await fetch("http://localhost:3000/passwords", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const passwords = await req.json();
            setPasswordArray(passwords);
        } catch (error) {
            console.error('Failed to fetch passwords:', error);
        }
    };

    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text);
    };

    const showPassword = () => {
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png";
            passwordRef.current.type = "password";
        } else {
            ref.current.src = "icons/eyecross.png";
            passwordRef.current.type = "text";
        }
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newPassword = { ...form, id: uuidv4() };
            try {
                await fetch("http://localhost:3000/passwords", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(newPassword),
                });
                setPasswordArray([...passwordArray, newPassword]);
                setform({ site: "", username: "", password: "" });
                toast('Password saved!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } catch (error) {
                console.error('Failed to save password:', error);
            }
        } else {
            toast('Error: Password not saved!');
        }
    };

    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password?");
        if (c) {
            try {
                await fetch("http://localhost:3000/passwords", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ id }),
                });
                setPasswordArray(passwordArray.filter(item => item.id !== id));
                toast('Password Deleted!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } catch (error) {
                console.error('Failed to delete password:', error);
            }
        }
    };

    const editPassword = (id) => {
        const selectedPassword = passwordArray.find(i => i.id === id);
        setform({ ...selectedPassword, id });
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />
            {!isAuthenticated ? (
                <div className="login-container">
                    <h1>Welcome to NeuroLock</h1>
                    <button
                        onClick={() => {
                            window.location.href = "http://localhost:3000/auth/google";
                        }}
                        className="bg-green-400 hover:bg-green-300 rounded-full px-8 py-2"
                    >
                        Login with Google
                    </button>
                </div>
            ) : (
                <div className="app-container">
                    {/* Existing Manager UI */}
                    {/* Add your existing JSX here */}
                </div>
            )}
        </>
    );
};

export default Manager;
