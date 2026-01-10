import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAppSelector} from "../store";

interface AdminRouteProps {
    children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const {user} = useAppSelector(globalState => globalState.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // 1️⃣ якщо немає юзера або немає ролі 'Admin'
        if (!user || !user.roles.includes("Admin")) {
            navigate("/"); // редірект на головну
        }
    }, [user, navigate]);

    // 2️⃣ поки не перевірили — нічого не рендеримо або можна спінер
    if (!user || !user.roles.includes("Admin")) return null;

    return <>{children}</>;
};

export default AdminRoute;
