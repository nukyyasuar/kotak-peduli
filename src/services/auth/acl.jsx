import { useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";

function decodeToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function useAccess(permission) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const decoded = decodeToken();
    const permissionsList =
      decoded?.collectionCenterCollaborator?.role?.permissions ||
      decoded?.role?.permissions ||
      [];
    setPermissions(permissionsList);
  }, []);

  const hasAccess = useMemo(() => {
    return permissions.includes(permission);
  }, [permission, permissions]);

  return hasAccess;
}
