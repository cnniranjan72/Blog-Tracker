import React from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../lib/firebase";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      console.log("Firebase ID Token:", idToken);

      // Save token in localStorage (for testing)
      localStorage.setItem("idToken", idToken);

      alert("Login successful! Token saved in localStorage.");
      navigate("/create-blog"); // redirect to create blog page
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
