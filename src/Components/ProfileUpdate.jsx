import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Container from "../Components/Container";
import { useAuth } from "../Hooks/useAuth";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const ProfileUpdate = () => {
  const { user, loading, setUser } = useAuth();

  // ইউজারের ডেটা অনুযায়ী স্টেট সেট করা
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center py-20 text-red-500 font-semibold">
        Please log in to update your profile.
      </p>
    );
  }

  // চেক করা ইউজারটি ইমেইল দিয়ে লগইন করেছে নাকি সোশ্যাল মিডিয়া (Google) দিয়ে
  const isPasswordUser = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  // নাম এবং ছবি আপডেট করার ফাংশন
  const handleGeneralUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // লোকাল স্টেট আপডেট করা যাতে রিফ্রেশ ছাড়াই পরিবর্তন দেখা যায়
      if (setUser) {
        setUser({ ...user, displayName, photoURL });
      }
      toast.success("Profile details updated successfully! 👍");
    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  // পাসওয়ার্ড আপডেট করার ফাংশন
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error(
        "Password must have 6+ characters, 1 uppercase & 1 lowercase."
      );
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      // পাসওয়ার্ড পরিবর্তনের আগে পুনরায় ভেরিফিকেশন (Re-authentication)
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success("Password updated successfully! ✅");

      // ইনপুট ফিল্ড ক্লিয়ার করা
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect current password.");
      } else {
        toast.error("Failed: " + error.message);
      }
    }
  };

  return (
    <Container className="py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-base-content">
        👤 Update Your Profile
      </h2>

      <div className="max-w-xl mx-auto space-y-8">
        {/* General Information Card */}
        <div className="card bg-base-100 shadow-xl p-6 border-t-4 border-green-500">
          <h3 className="text-2xl font-semibold mb-4 text-green-600">
            General Information
          </h3>
          <form onSubmit={handleGeneralUpdate} className="space-y-4">
            <div className="form-control">
              <label className="label font-medium">Display Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-medium">Photo URL</label>
              <input
                type="url"
                className="input input-bordered w-full"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-full text-white mt-4"
            >
              Update Details
            </button>
          </form>
        </div>

        {/* Password Change Card (Conditional Rendering) */}
        <div className="card bg-base-100 shadow-xl p-6 border-t-4 border-red-500">
          <h3 className="text-2xl font-semibold mb-4 text-red-600">Security</h3>

          {isPasswordUser ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label font-medium">Current Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label font-medium">New Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-error w-full text-white mt-4"
              >
                Change Password
              </button>
            </form>
          ) : (
            <div className="alert alert-warning shadow-sm">
              <span>Google/Social users cannot change passwords here.</span>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProfileUpdate;
