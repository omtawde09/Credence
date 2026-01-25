import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuthModal from "./components/AuthModal";
import RoleSelectionModal from "./components/RoleSelectionModal";
import useAuthStore from "./store/useAuthStore";

export default function Layout() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      <NavBar />
      <AuthModal />
      <RoleSelectionModal />
      <Outlet />
    </div>
  );
}
