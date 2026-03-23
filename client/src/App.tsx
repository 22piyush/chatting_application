import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { getUser, setOnlineUsers } from "./store/slices/authSlice";
import { connectSocket, disconnectSocket } from "./lib/socket";

// router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// components
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// icons
import { Loader } from "lucide-react";

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useAppDispatch();

  const { authUser, isCheckingAuth } = useAppSelector(
    (state) => state.auth
  );

  // get user
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // socket connection
  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);

    socket.on("getOnlineUsers", (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      disconnectSocket();
    };
  }, [authUser, dispatch]);

  // loader
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {authUser && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />

        {/*FIXED */}
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

      {/*Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;