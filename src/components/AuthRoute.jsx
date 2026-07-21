import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const AuthRoute = ({ children, role }) => {

    const { user, loading } = useAuth();


    // Wait until token validation finishes
    if (loading) {

        return (
            <div className="text-center mt-20">
                Loading...
            </div>
        );

    }



    // No user logged in
    if (!user) {

        return (
            <Navigate 
                to="/login"
                replace
            />
        );

    }



    // Role protection
    const userRole = user?.role ? String(user.role).replace(/^ROLE_/, "").toUpperCase() : "";
    const targetRole = role ? String(role).replace(/^ROLE_/, "").toUpperCase() : "";

    if (targetRole && userRole !== targetRole) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }



    return children;

};


export default AuthRoute;