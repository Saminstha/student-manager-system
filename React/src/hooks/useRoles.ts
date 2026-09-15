import { useEffect, useState } from "react";
import { fetchRoles } from "../store/rolesApi";
import type { UserRole } from "../store/usersSlice";

// Roles are simple, read-only reference data with no create/edit/delete
// UI anywhere — just plain component state instead of a full Redux slice.
function useRoles() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading };
}

export default useRoles;
