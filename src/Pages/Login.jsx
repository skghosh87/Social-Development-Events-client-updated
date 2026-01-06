import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaSignInAlt,
  FaUserShield,
  FaUserFriends,
} from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null); // পাসওয়ার্ড ফিল্ডের জন্য নতুন রিফ
  const { signIn, signInWithGoogle, resetPassword, setLoading, user, loading } =
    useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (user) navigate(from);
  }, [user, from, navigate]);

  // ডেমো ক্রেডেনশিয়াল হ্যান্ডলার
  const handleDemoLogin = (role) => {
    if (role === "admin") {
      emailRef.current.value = "admin@sdep.com";
      passwordRef.current.value = "Admin123";
      toast.info("Admin ডেমো তথ্য ইনপুট করা হয়েছে।");
    } else {
      emailRef.current.value = "user@sdep.com";
      passwordRef.current.value = "User123";
      toast.info("Volunteer ডেমো তথ্য ইনপুট করা হয়েছে।");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("অনুগ্রহ করে ইমেল এবং পাসওয়ার্ড লিখুন।");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      toast.success("লগইন সফল হয়েছে!");
      navigate(from);
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success("Google Login Successful!");
      navigate(from);
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    const email = emailRef.current?.value.trim();
    if (!email) {
      toast.error("পাসওয়ার্ড রিসেট করতে ইমেল লিখুন।");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      toast.success("পাসওয়ার্ড রিসেট লিংক আপনার ইমেলে পাঠানো হয়েছে।");
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-100">
          <h2 className="text-3xl font-black text-center text-green-700 mb-2 flex items-center justify-center gap-2">
            <FaSignInAlt className="text-green-500" /> Welcome Back!
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm font-medium">
            SDEP প্ল্যাটফর্মে স্বাগতম
          </p>

          {/* --- ডেমো ক্রেডেনশিয়াল সেকশন --- */}
          <div className="mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-[10px] font-bold text-green-700 uppercase mb-3 tracking-widest text-center">
              Quick Access (Demo)
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="flex-1 flex items-center justify-center gap-2 text-[12px] bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-all font-bold shadow-sm"
              >
                <FaUserShield size={14} /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("user")}
                className="flex-1 flex items-center justify-center gap-2 text-[12px] bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all font-bold shadow-sm"
              >
                <FaUserFriends size={14} /> Volunteer
              </button>
            </div>
          </div>
          {/* --------------------------- */}

          <form onSubmit={handleSignin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">
                Email Address
              </label>
              <input
                type="email"
                ref={emailRef}
                name="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-gray-900 bg-gray-50/50"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                ref={passwordRef}
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-gray-900 bg-gray-50/50"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-4 top-[38px] cursor-pointer text-gray-400 hover:text-green-600 transition-colors"
              >
                {show ? <IoEyeOff size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Processing..." : "Sign In to Account"}
            </button>

            <div className="flex items-center justify-center gap-3 py-2">
              <div className="h-[1px] flex-1 bg-gray-200"></div>
              <span className="text-[10px] font-black text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignin}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition active:scale-[0.98]"
            >
              <FcGoogle className="mr-3 text-xl" /> Google login
            </button>

            <p className="text-center text-sm text-gray-500 pt-2">
              Don’t have an account?
              <Link
                to="/register"
                className="text-green-600 hover:underline font-bold ml-1"
              >
                Register Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
