import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar";
import AuthModal from "./Components/AuthModal";
import useAuthStore from "./store/useAuthStore";

export default function Layout() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-[#0E0B08] text-[#F5F1ED] font-sans selection:bg-[#3D2419] overflow-hidden">

      <NavBar />
      <AuthModal />
      <Outlet />
    </div>
  );
}
