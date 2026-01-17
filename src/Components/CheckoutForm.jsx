import React, { useState, useEffect, useRef } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaLock, FaDollarSign, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const MIN_AMOUNT = 5;

const CheckoutForm = ({ onPaymentSuccess, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [amount, setAmount] = useState(price || MIN_AMOUNT);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSecretLoading, setIsSecretLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // একাধিকবার একই এপিআই কল রোধ করতে useRef ব্যবহার
  const lastFetchedAmount = useRef(null);

  /* ==========================================
      ১. Client Secret জেনারেট করা
     ========================================== */
  useEffect(() => {
    // প্রপস থেকে আসা প্রাইস আপডেট হলে লোকাল স্টেট আপডেট করা
    if (price && price !== amount) {
      setAmount(price);
    }
  }, [price]);

  useEffect(() => {
    if (amount < MIN_AMOUNT || amount === lastFetchedAmount.current) return;

    const fetchClientSecret = async () => {
      setIsSecretLoading(true);
      try {
        const res = await axiosSecure.post("/api/create-payment-intent", {
          price: amount,
        });

        if (res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
          lastFetchedAmount.current = amount;
        }
      } catch (err) {
        console.error("Stripe Secret Error:", err);
        setCardError("পেমেন্ট গেটওয়ে কানেক্ট করা যাচ্ছে না।");
      } finally {
        setIsSecretLoading(false);
      }
    };

    const timer = setTimeout(fetchClientSecret, 500);
    return () => clearTimeout(timer);
  }, [amount, axiosSecure]);

  /* ==========================================
      ২. পেমেন্ট সাবমিট করা
     ========================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret || isProcessing) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setIsProcessing(true);
    setCardError("");

    try {
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Anonymous Donor",
              email: user?.email || "unknown@email.com",
            },
          },
        });

      if (confirmError) {
        setCardError(confirmError.message);
        setIsProcessing(false);
      } else if (paymentIntent?.status === "succeeded") {
        setPaymentDone(true);
        setIsProcessing(false);
        // মেইন পেজে ট্রানজেকশন আইডি এবং এমাউন্ট পাঠানো
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentIntent.id, amount);
        }
      }
    } catch (err) {
      console.error("Payment Execution Error:", err);
      setCardError("পেমেন্ট প্রসেস করার সময় ত্রুটি হয়েছে।");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-transparent">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
            Contribution Amount ($)
          </label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary z-10" />
            <input
              type="number"
              min={MIN_AMOUNT}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-secondary/50 font-bold dark:text-white transition-all"
              required
              disabled={paymentDone || isProcessing}
            />
          </div>
        </div>

        {/* Card Element */}
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
              Card Details
            </label>
            {isSecretLoading && (
              <span className="text-[10px] text-secondary animate-pulse font-bold uppercase">
                Securing...
              </span>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-inner">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: window.matchMedia("(prefers-color-scheme: dark)")
                      .matches
                      ? "#ffffff"
                      : "#424770",
                    "::placeholder": { color: "#aab7c4" },
                    fontFamily: "'Inter', sans-serif",
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
        </div>

        {cardError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <p className="text-xs text-red-500 font-bold flex items-center gap-2">
              ⚠️ {cardError}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing || paymentDone}
          className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
            paymentDone
              ? "bg-green-500 text-white"
              : isProcessing || !clientSecret
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-secondary hover:bg-blue-700 text-white active:scale-95"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>{" "}
              Processing...
            </span>
          ) : paymentDone ? (
            <>
              <FaCheckCircle size={18} /> Verified & Paid
            </>
          ) : (
            <>
              <FaLock size={14} /> Confirm ${amount} Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
