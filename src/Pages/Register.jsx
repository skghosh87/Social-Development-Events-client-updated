import React, { useState } from "react";
import { FaEye, FaGoogle, FaUserPlus } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Context/AuthProvider";
import Container from "../Components/Container";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, setLoading } =
    useAuth();

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

    const validationMessage =
      "Password must be at least 6 characters long and include one uppercase and one lowercase letter.";
    const regExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!regExp.test(password)) {
      setPasswordError(validationMessage);
      toast.error(validationMessage, { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      toast.success("Registration Successful! Welcome to SDEP", {
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      const errorMessage = parseFirebaseError(error);
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success("Google Sign-Up Successful!", { position: "top-center" });
      navigate("/");
    } catch (error) {
      const errorMessage = parseFirebaseError(error);
      toast.error(`Google sign-up failed: ${errorMessage}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-green-200">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6 flex items-center justify-center gap-2">
            <FaUserPlus className="text-green-500 text-3xl" /> Create Your
            Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Photo URL (Optional)
              </label>
              <input
                id="photo"
                type="text"
                name="photo"
                placeholder="Your photo URL"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@email.com"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 mt-2 cursor-pointer text-green-600 text-xl"
              >
                {show ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>

            {passwordError && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            >
              Register Account
            </button>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-full bg-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="h-px w-full bg-gray-200"></div>
              </div>
              <button
                onClick={handleGoogleSignup}
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                <FaGoogle className="mr-3 text-red-500 text-xl" />
                Sign up with Google
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="text-sm text-gray-500">
                Already have an account?
                <Link
                  to="/login"
                  className="text-green-600 hover:underline font-medium ml-1"
                >
                  Login Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Register;
