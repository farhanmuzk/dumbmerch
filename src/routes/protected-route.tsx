import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
    const token = Cookies.get('authToken');
    const userRole = Cookies.get('userRole'); 
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Cek apakah peran user termasuk dalam allowedRoles
    if (!allowedRoles.includes(userRole ?? '')) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
