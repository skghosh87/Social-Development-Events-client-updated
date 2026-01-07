import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axios from "axios";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

  const { data: isAdmin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!user?.email, // ইউজার লোডিং শেষ হলে এবং ইমেইল থাকলে রান হবে
    queryFn: async () => {
      const res = await axios.get(`${SERVER_BASE_URL}/api/users/admin/${user.email}`);
      return res.data?.admin; // আপনার ব্যাকএন্ড থেকে { admin: true/false } পাঠাতে হবে
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;