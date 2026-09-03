import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace/>    
    }

    if(role && user.role?.toUpperCase() !== role.toUpperCase()) {
        const fallback = user.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
        return <Navigate to={fallback} replace/>
    }

    return children
}