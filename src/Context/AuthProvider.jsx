import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../Firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token"); // লগআউট করলে টোকেন মুছে ফেলা হবে
    setRole(null);
    setStatus(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // ১. JWT টোকেন সংগ্রহ
          const tokenRes = await axios.post(`${SERVER_BASE_URL}/api/jwt`, {
            email: currentUser.email,
          });

          if (tokenRes.data.token) {
            const token = tokenRes.data.token;
            localStorage.setItem("access-token", token);

            // ২. রোল এবং স্ট্যাটাস সংগ্রহ
            const res = await axios.get(
              `${SERVER_BASE_URL}/api/users/role/${currentUser.email}`,
              { headers: { authorization: `Bearer ${token}` } }
            );

            setRole(res.data.admin ? "admin" : "user");
            setStatus(res.data.status);
          }
        } catch (error) {
          console.error("Auth sync error:", error);
          setRole("user");
        } finally {
          // সব ডাটা লোড হওয়ার পর লোডিং ফলস হবে
          setLoading(false);
        }
      } else {
        localStorage.removeItem("access-token");
        setRole(null);
        setStatus(null);
        setLoading(false); // ইউজার না থাকলেও লোডিং ফলস হবে
      }
    });

    return () => unsubscribe();
  }, [SERVER_BASE_URL]);

  const authInfo = {
    user,
    role,
    status,
    loading,
    setLoading,
    createUser,
    updateUserProfile,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
