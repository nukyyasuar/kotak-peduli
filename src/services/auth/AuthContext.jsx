"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
  permissions: [],
  hasPermission: () => false,
});

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const permissionsList =
          decoded?.collectionCenterCollaborator?.role?.permissions ||
          decoded?.role?.permissions ||
          [];
        setPermissions(permissionsList);
      } catch (e) {
        console.error("Invalid token", e);
        setPermissions([]);
      }
    }
  }, []);

  const hasPermission = (perm) => permissions.includes(perm);

  return (
    <AuthContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
