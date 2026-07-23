import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    // 1. If not logged in, go to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 2. If role is not allowed, go back home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    // 3. If all checks pass, show the page
    return children;
};

export default ProtectedRoute;