import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement de la session...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
