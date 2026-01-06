import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};
