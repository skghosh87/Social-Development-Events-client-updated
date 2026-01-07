import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCreditCard, FaLock, FaDollarSign } from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth"; // ইউজার ইনফো নেওয়ার জন্য

const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth(); // ইউজারের নাম এবং ইমেইল পেতে
  const [amount, setAmount] = useState(5);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ১. পেমেন্ট ইনটেন্ট তৈরি করা (Debounced useEffect)
  useEffect(() => {
    // শুধুমাত্র ৫ বা তার বেশি হলে ব্যাকএন্ডে রিকোয়েস্ট যাবে
    if (amount >= 5) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .post(`${SERVER_BASE_URL}/api/create-payment-intent`, {
            price: amount,
          })
          .then((res) => {
            setClientSecret(res.data.clientSecret);
          })
          .catch((err) => {
            console.error("Error creating payment intent:", err);
            toast.error("পেমেন্ট গেটওয়ে কানেক্ট করতে সমস্যা হচ্ছে।");
          });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setClientSecret(""); // অ্যামাউন্ট ৫ এর নিচে নামলে সিক্রেট মুছে দাও
    }
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setIsProcessing(true);
    setCardError("");

    // ২. পেমেন্ট কনফার্ম করা
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "Anonymous Donor",
            email: user?.email || "unknown@email.com",
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setIsProcessing(false);
    } else {
      if (paymentIntent.status === "succeeded") {
        toast.success(`$${amount} পেমেন্ট সফল হয়েছে!`);
        // ৩. মেইন ফাংশনে ট্রানজেকশন আইডি এবং ফাইনাল অ্যামাউন্ট পাঠানো
        onPaymentSuccess(paymentIntent.id, amount);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            সহযোগিতার পরিমাণ ($)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaDollarSign className="text-blue-500 group-focus-within:text-blue-600" />
            </div>
            <input
              type="number"
              min="5"
              step="0.01" // সেন্ট পেমেন্টের জন্য ডেসিমাল সাপোর্ট
              value={amount}
              onChange={(e) =>
                setAmount(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="pl-9 w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
              placeholder="অ্যামাউন্ট"
              required
            />
          </div>
          {amount > 0 && amount < 5 && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              ⚠️ নূন্যতম ৫ ডলার পেমেন্ট করতে হবে।
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <FaCreditCard /> <span>কার্ডের তথ্য প্রদান করুন</span>
          </div>
          <div className="p-4 border-2 border-gray-100 rounded-xl bg-white shadow-inner focus-within:border-blue-300 transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1a202c",
                    "::placeholder": { color: "#a0aec0" },
                  },
                },
              }}
            />
          </div>
        </div>

        {cardError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {cardError}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing || amount < 5}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 ${
            isProcessing || !stripe || amount < 5
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-xl"
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              প্রসেসিং...
            </>
          ) : (
            <>
              <FaLock className="text-sm" />
              Pay ${amount} & Confirm
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
