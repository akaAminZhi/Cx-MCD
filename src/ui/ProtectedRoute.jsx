import { useUser } from "../features/authentication/useUser";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // load user
  const { user, isPending, isAuthenticated } = useUser();
  // while loading show spinner
  // if not auth, redirect to /login
  useEffect(
    function () {
      if (!isAuthenticated && !isPending) {
        console.log("haha");
        navigate("/login");
      }
    },
    [isAuthenticated, isPending, navigate]
  );
  if (isPending) return <Spinner></Spinner>;

  //   if yes show
  if (user?.role === "authenticated") return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
