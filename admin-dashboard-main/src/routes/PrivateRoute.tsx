import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";

interface Props {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const location = useLocation();

    const isAuthenticated = useAppSelector(
        (state) => !!state.auth.user
    );

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/signin"
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
};

export default PrivateRoute;