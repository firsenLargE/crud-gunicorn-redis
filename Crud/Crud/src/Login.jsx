import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle to Sign Up form
  const handleSignupToggle = () => {
    setSignUp(!signUp);
    setFormData({ username: "", email: "", password: "" }); 
  };

  // Handle login
  const handleLogin = () => {
    axiosInstance.post("/login/", {
      username: formData.username,
      password: formData.password
    }
    ).then((response) => {
      console.log("Login response:", response.data);
      localStorage.setItem("access_token", response.data.token);
      localStorage.setItem("username", formData.username);
       setIsLoggedIn(true);

      // Redirect to dashboard
      navigate("/dashboard");
    }).catch((error) => { 
      console.error("Login error:", error);
    });
  };

  const handleSignUpSubmit = () => {
    axiosInstance.post("/signup/", formData).then((response) => {
      alert(`Account created for ${formData.username} (${formData.email})`);
      setSignUp(false); // switch back to login
      setFormData({ username: "", email: "", password: "" });
      console.log("Signup response:", response.data);
     })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 " style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60')", backgroundSize: 'cover' }}>
    <div className="mx-auto my-10 max-w-sm rounded-lg border border-gray-200 p-8 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-bold text-blue-500">
        {signUp ? "Sign Up" : "Login"}
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />

        {signUp && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <p className="text-sm text-gray-600">
          {signUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={handleSignupToggle}
            className="text-md text-blue-700 cursor-pointer underline"
          >
            {signUp ? "Login" : "Sign Up"}
          </span>
        </p>

        <button
          onClick={signUp ? handleSignUpSubmit : handleLogin}
          className="w-full rounded bg-black py-2 font-medium text-white transition-colors hover:bg-gray-800"
        >
          {signUp ? "Sign Up" : "Login"}
        </button>
      </div>
      </div>
      </div>
  );
};

export default Login; 