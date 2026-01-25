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
    if (!userRole) {
        // Show a simple loading indicator while role selection is happening
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
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
