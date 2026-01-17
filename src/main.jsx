import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./Routes/Routes.jsx";
import AuthProvider from "./Context/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ১. React Query ইমপোর্ট করুন
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ২. একটি নতুন QueryClient ইনস্ট্যান্স তৈরি করুন
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ৩. AuthProvider-এর ভেতরে QueryClientProvider দিন */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
    <ToastContainer position="top-center" autoClose={2000} theme="colored" />
  </StrictMode>
);
