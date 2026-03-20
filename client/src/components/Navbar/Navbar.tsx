import { LogOut, User, MessageSquare, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";

function Navbar() {
  const { authUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white">
      
      {/* Left - Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <MessageSquare />
        <span className="font-bold text-lg">ChatApp</span>
      </div>

      {/* Right - Menu */}
      <div className="flex items-center gap-6">
        
        {/* Profile */}
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-gray-300"
          onClick={() => navigate("/profile")}
        >
          <User size={20} />
          <span>{authUser?.name || "Profile"}</span>
        </div>

        {/* Settings */}
        <div className="cursor-pointer hover:text-gray-300">
          <Settings size={20} />
        </div>

        {/* Logout */}
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;