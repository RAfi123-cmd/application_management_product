import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children, role }) {
    const { user, logout } = useAuth();

    const isRoleMismatch = Boolean(
        user && role && user.role?.toUpperCase() !== role.toUpperCase()
    )

    useEffect(() => {
        if (isRoleMismatch) {
            logout();
        }
    }, [isRoleMismatch, logout]);


    if (!user) {
        return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace/>    
    }

    if (isRoleMismatch) {
        const fallback = user.role?.toUpperCase() === 'ADMIN' ? '/admin/login' : '/login'
        return <Navigate to={fallback} replace/>
    }

    if(role && user.role?.toUpperCase() !== role.toUpperCase()) {
        const fallback = user.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
        return <Navigate to={fallback} replace/>
    }

    return children
}