import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { getUser, setOnlineUsers } from "./store/slices/authSlice";
import { connectSocket, disconnectSocket } from "./lib/socket";

function App() {
  const dispatch = useAppDispatch();

  const { authUser, isCheckingAuth } = useAppSelector(
    (state) => state.auth
  );

  //get user
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

    //cleanup
    return () => {
      disconnectSocket(); //correct
    };
  }, [authUser, dispatch]);

  if (isCheckingAuth) return <div>Loading...</div>;

  return (
    <div>
      {authUser ? `Welcome ${authUser.name}` : "Not logged in"}
    </div>
  );
}

export default App;