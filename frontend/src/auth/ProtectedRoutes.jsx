import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

export const BuyerProtectedRoute = () => {
  const location = useLocation();
  const userLoggedIn = useSelector((state) => state.Users.isLoggedIn);
  const sellerLoggedIn = useSelector((state) => state.Sellers.isLoggedIn);

  if (!userLoggedIn) {
    return <Navigate
      to={sellerLoggedIn ? "/" : "/login"}
      state={sellerLoggedIn ? undefined : { from: location }}
      replace
    />;
  }

  return <Outlet />;
};

export const SellerProtectedRoute = () => {
  const location = useLocation();
  const userLoggedIn = useSelector((state) => state.Users.isLoggedIn);
  const sellerLoggedIn = useSelector((state) => state.Sellers.isLoggedIn);

  if (!sellerLoggedIn) {
    return <Navigate
      to={userLoggedIn ? "/" : "/login"}
      state={userLoggedIn ? undefined : { from: location }}
      replace
    />;
  }

  return <Outlet />;
};
