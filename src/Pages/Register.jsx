import React, { useState } from "react";
import { FaEye, FaGoogle, FaUserPlus } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import Container from "../Components/Container";
import { useAuth } from "../Hooks/useAuth";

const Register = () => {
  const {
    createUser,
    updateUserProfile,
    signInWithGoogle,
    logOut, // সেশন ক্লিয়ার করার জন্য লগআউট ইম্পোর্ট করা হলো
    setLoading,
    loading,
  } = useAuth();
  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";
  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const parseFirebaseError = (error) => {
    let errorMessage = error.message
      .replace("Firebase: Error (auth/", "")
      .replace(").", "")
      .replaceAll("-", " ")
      .trim();
    if (errorMessage.includes("email already in use")) {
      errorMessage = "This email is already registered. Please sign in.";
    }
    return errorMessage;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const photoURL =
      form.get("photo") || "https://i.ibb.co/5vFwYxS/default-user.png";
    const email = form.get("email");
    const password = form.get("password");

    setPasswordError("");
    const regExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!regExp.test(password)) {
      const msg = "Password must be 6+ chars, 1 uppercase & 1 lowercase.";
      setPasswordError(msg);
      return toast.error(msg);
    }

    try {
      setLoading(true);
      // ১. ফায়ারবেসে ইউজার তৈরি
      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      // ২. ব্যাকএন্ডে ইউজার ডেটা পাঠানো (https:// সহ)
      const newUser = { name, email, photoURL, role: "user", status: "active" };
      await axios.post(`${SERVER_BASE_URL}/api/users`, newUser);

      // ৩. ফায়ারবেস অটো-লগইন ক্লিয়ার করা (ঐচ্ছিক কিন্তু ভালো প্র্যাকটিস)
      await logOut();

      toast.success("Registration Successful! Please login to continue.");
      navigate("/login"); // লগইন পেজে রিডাইরেক্ট
    } catch (error) {
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;

      const newUser = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
        status: "active",
      };

      // ব্যাকএন্ডে সেভ করা
      await axios.post(`${SERVER_BASE_URL}/api/users`, newUser);

      // গুগল সাইন-আপের পর সেশন ক্লিয়ার করে লগইন পেজে পাঠানো
      await logOut();

      toast.success("Account created with Google! Please login now.");
      navigate("/login");
    } catch (error) {
      toast.error("Google sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-green-100">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6 flex items-center justify-center gap-2">
            <FaUserPlus /> Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo URL (Optional)
              </label>
              <input
                type="text"
                name="photo"
                placeholder="https://example.com/photo.jpg"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-[42px] cursor-pointer text-gray-500 text-xl"
              >
                {show ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Register Account"}
            </button>

            <div className="divider text-xs text-gray-400">OR</div>

            <button
              onClick={handleGoogleSignup}
              type="button"
              disabled={loading}
              className="w-full flex items-center justify-center py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              <FaGoogle className="mr-2 text-red-500" /> Sign up with Google
            </button>

            <p className="text-center text-sm mt-4 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 font-bold hover:underline"
              >
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
