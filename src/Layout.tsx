import { useEffect } from "react";
import { Outlet } from "react-router-dom";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">


      <AuthModal />
      <RoleSelectionModal />
      <Outlet />
    </div>
  );
}
