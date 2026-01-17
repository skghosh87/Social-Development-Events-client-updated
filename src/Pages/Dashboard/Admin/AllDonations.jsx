import React, { useEffect, useState } from "react";
import {
  FaDonate,
  FaCheckCircle,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ১. ডেটা ফেচ করার ফাংশন (সংশোধিত এন্ডপয়েন্ট: /api/donations)
  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      // আপনার কনসোল এরর বলছে /api/joined-events খুঁজে পাচ্ছে না।
      // তাই এখানে আমরা আপনার ব্যাকএন্ডের সঠিক রাউট /api/donations ব্যবহার করছি।
      const res = await axiosSecure.get("/api/donations");
      setDonations(res.data || []);
    } catch (err) {
      console.error("Error fetching donations:", err);
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ২. রেকর্ড ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এটি ডিলিট করলে আর ফিরে পাবেন না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/api/donations/${id}`);
          if (res.data.deletedCount > 0) {
            setDonations(donations.filter((item) => item._id !== id));
            Swal.fire(
              "ডিলিট হয়েছে!",
              "রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে।",
              "success"
            );
          }
        } catch (err) {
          toast.error("ডিলিট করতে সমস্যা হয়েছে।");
        }
      }
    });
  };

  // ৩. সার্চ ফিল্টারিং
  const filteredDonations = donations.filter(
    (item) =>
      item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-500 uppercase tracking-widest text-xs">
          Loading Records...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase flex items-center gap-3">
            <FaDonate className="text-secondary" />
            Event <span className="text-secondary">Donations</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mt-1 ml-1">
            Financial History & Event Records
          </p>
        </div>

        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search Email or Transaction..."
            className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-secondary outline-none font-medium text-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Total Amount
          </p>
          <h4 className="text-3xl font-black text-slate-800 dark:text-white">
            $
            {donations.reduce(
              (acc, curr) => acc + (Number(curr.amount) || 0),
              0
            )}
          </h4>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Total Donors
          </p>
          <h4 className="text-3xl font-black text-slate-800 dark:text-white">
            {donations.length}
          </h4>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Status
          </p>
          <h4 className="text-3xl font-black text-green-500 flex items-center gap-2">
            Verified <FaCheckCircle size={20} />
          </h4>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                  Donor
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                  Event Name
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                  Transaction ID
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredDonations.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <FaUser size={12} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">
                          {item.userName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                          {item.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {item.eventName}
                  </td>
                  <td className="p-6 font-mono text-[11px] text-slate-500">
                    {item.transactionId}
                  </td>
                  <td className="p-6 font-black text-slate-800 dark:text-white text-lg">
                    ${item.amount}
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDonations.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDonations;
