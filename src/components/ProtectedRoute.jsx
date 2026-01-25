import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// Protected route wrapper that requires specific role
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, userRole } = useAuthStore();

    // If not logged in, redirect to home
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If user is logged in but no role selected yet, show a loading/waiting state
    // The role selection modal should be open at this point
    // If user is logged in but no role selected yet
    if (!userRole) {
        // If we are waiting for role, it might mean we need to select one.
        // The AuthStore initializes role selection modal, so we can just show a "Setting up..." message
        // Or render children if we want to allow access while role fetches (unsafe)

        // Better: Check if we are stuck. If it takes too long, maybe we just default to 'investor' for now
        // But for now, let's keep the spinner but ensure the Modal is open
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Synced. Fetching Profile...</p>
                    <div className="flex flex-col gap-2 mt-4">
                        <button onClick={() => window.location.reload()} className="text-xs text-blue-500 hover:underline">Taking too long? Reload</button>
                        <button
                            onClick={() => useAuthStore.getState().openRoleSelection()}
                            className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100"
                        >
                            Select Role Manually
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // If role doesn't match required role, redirect to appropriate dashboard
    if (requiredRole && userRole !== requiredRole) {
        if (userRole === 'investor') {
            return <Navigate to="/dashboard" replace />;
        } else if (userRole === 'advisor') {
            return <Navigate to="/advisor-dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
