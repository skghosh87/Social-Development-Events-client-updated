import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext"; // আপনার আলাদা কনটেক্সট ফাইলটি ইম্পোর্ট করা হলো
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
  const [role, setRole] = useState(null); // ডাটাবেজ থেকে আসা রোল (admin/user)
  const [status, setStatus] = useState(null); // ইউজারের স্ট্যাটাস (active/suspended)
  const [loading, setLoading] = useState(true);

  // ১. নতুন ইউজার তৈরি
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ২. ইমেইল-পাসওয়ার্ড দিয়ে লগইন
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. গুগল লগইন
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ৪. প্রোফাইল আপডেট
  const updateUserProfile = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  // ৫. পাসওয়ার্ড রিসেট
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // ৬. লগআউট
  const logOut = () => {
    setLoading(true);
    setRole(null);
    setStatus(null);
    return signOut(auth);
  };

  // ৭. ইউজার এবং রোল ম্যানেজমেন্ট (অটোমেটিক মনিটর)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // আপনার ব্যাকএন্ড থেকে ইউজারের রোল এবং স্ট্যাটাস চেক করা
          const res = await axios.get(
            `social-development-events-seven.vercel.app/api/users/role/${currentUser.email}`
          );
          setRole(res.data.role);
          setStatus(res.data.status);
        } catch (error) {
          console.error("Error fetching user role from DB:", error);
          setRole("user"); // কোনো এরর হলে ডিফল্ট 'user' হিসেবে রাখা নিরাপদ
        }
      } else {
        setRole(null);
        setStatus(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // কনটেক্সটের মাধ্যমে শেয়ার করা সব তথ্য
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
