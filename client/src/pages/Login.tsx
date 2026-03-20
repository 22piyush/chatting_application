import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";

function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email:"",
    password: ""
  });

    const { isLoggingIn } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit =(e)=>{
      e.preventDefault();
      dispatch(login(formData));
    }

  return (
    <div>Login</div>
  )
}

export default Login