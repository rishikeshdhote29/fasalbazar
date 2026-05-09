import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const location = useLocation();
  const {isLoggedIn} = useSelector((state) => state.Users);

  if (!isLoggedIn) {
	return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
