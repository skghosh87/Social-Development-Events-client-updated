import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axios from "axios";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const SERVER_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://social-development-events-seven.vercel.app";

  const { data: isAdmin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],

    enabled:
      !loading && !!user?.email && !!localStorage.getItem("access-token"),
    queryFn: async () => {
      const token = localStorage.getItem("access-token");

      const res = await axios.get(
        `${SERVER_BASE_URL}/api/users/role/${user.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Admin API Check for:", user.email, res.data);

      return res.data?.admin === true;
    },

    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;
