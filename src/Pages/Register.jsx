import React, { useState } from "react";
import { FaEye, FaGoogle, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Hooks/useAuth";

const Register = () => {
  const {
    createUser,
    updateUserProfile,
    signInWithGoogle,
    logOut,
    setLoading,
    loading,
  } = useAuth();

  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const parseFirebaseError = (error) => {
    let errorMessage = error.message
      .replace("Firebase: Error (auth/", "")
      .replace(").", "")
      .replaceAll("-", " ")
      .trim();
    if (errorMessage.includes("email already in use")) {
      errorMessage = "এই ইমেলটি ইতিমধ্যে ব্যবহার করা হয়েছে।";
    }
    return errorMessage;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const photoURL =
      form.photo.value || "https://i.ibb.co/5vFwYxS/default-user.png";
    const email = form.email.value;
    const password = form.password.value;

    const regExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!regExp.test(password)) {
      return toast.error(
        "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে এবং একটি বড় ও ছোট হাতের অক্ষর থাকতে হবে।"
      );
    }

    try {
      setLoading(true);
      // ১. ফায়ারবেস ইউজার ক্রিয়েশন
      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      // ২. ব্যাকএন্ডে ইউজার ডেটা সেভ
      const newUser = { name, email, photoURL, role: "user", status: "active" };
      await axios.post(`${SERVER_BASE_URL}/api/users`, newUser);

      // সেশন ক্লিয়ার করে লগইন পেজে পাঠানো
      await logOut();
      toast.success("নিবন্ধন সফল হয়েছে! অনুগ্রহ করে লগইন করুন।");
      navigate("/login");
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

      await axios.post(`${SERVER_BASE_URL}/api/users`, newUser);
      await logOut();
      toast.success("গুগল দিয়ে অ্যাকাউন্ট তৈরি হয়েছে! লগইন করুন।");
      navigate("/login");
    } catch (error) {
      toast.error("গুগল সাইন-আপ ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-8 left-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-secondary transition-all"
        >
          <FaArrowLeft size={18} />
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaUserPlus size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Create <span className="text-secondary">Account</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Join our community and start your journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2 block ml-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2 block ml-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="hello@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                required
              />
            </div>

            {/* Photo URL */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2 block ml-2">
                Photo URL (Optional)
              </label>
              <input
                type="text"
                name="photo"
                placeholder="https://..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2 relative">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2 block ml-2">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-11 text-slate-400 hover:text-secondary transition-colors"
              >
                {show ? <IoEyeOff size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {loading ? "Registering..." : "Sign Up Now"}
          </button>

          <div className="relative flex items-center justify-center my-8">
            <div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
              Or continue with
            </span>
          </div>

          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white font-black rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-800 uppercase tracking-widest text-[10px]"
          >
            <FaGoogle className="text-red-500" size={18} /> Sign up with Google
          </button>

          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary hover:underline ml-1">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
