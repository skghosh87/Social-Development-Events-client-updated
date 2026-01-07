import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCreditCard, FaLock, FaDollarSign } from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";

const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";
const MIN_AMOUNT = 5;

const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [amount, setAmount] = useState(MIN_AMOUNT);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSecretLoading, setIsSecretLoading] = useState(false);

  // 🔐 Payment Intent তৈরি (Debounced + Safe)
  useEffect(() => {
    if (amount < MIN_AMOUNT) {
      setClientSecret("");
      return;
    }

    let isMounted = true;
    setIsSecretLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await axios.post(
          `${SERVER_BASE_URL}/api/create-payment-intent`,
          { price: amount }
        );

        if (isMounted && res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
        }
      } catch (err) {
        console.error("Stripe Client Secret Error:", err);
        toast.error("পেমেন্ট ইনিশিয়ালাইজ করা যায়নি।");
        setClientSecret("");
      } finally {
        if (isMounted) setIsSecretLoading(false);
      }
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [amount]);

  // 💳 Payment Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setCardError("কার্ড ইনপুট পাওয়া যায়নি।");
      return;
    }

    setIsProcessing(true);
    setCardError("");

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Anonymous Donor",
              email: user?.email || "unknown@email.com",
            },
          },
        }
      );

      if (error) {
        setCardError(error.message || "পেমেন্ট ব্যর্থ হয়েছে।");
      } else if (paymentIntent?.status === "succeeded") {
        toast.success(`$${amount} পেমেন্ট সফল হয়েছে 🎉`);
        onPaymentSuccess?.(paymentIntent.id, amount);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setCardError("পেমেন্ট সম্পন্ন করতে সমস্যা হয়েছে।");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            সহযোগিতার পরিমাণ ($)
          </label>

          <div className="relative">
            <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type="number"
              min={MIN_AMOUNT}
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(Math.max(0, Number(e.target.value) || 0))
              }
              className="pl-9 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              required
            />
          </div>

          {amount > 0 && amount < MIN_AMOUNT && (
            <p className="text-xs text-red-500 mt-1">
              সর্বনিম্ন ${MIN_AMOUNT} প্রদান করতে হবে
            </p>
          )}
        </div>

        {/* Card Section */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-2">
              <FaCreditCard /> কার্ডের তথ্য
            </div>
            {isSecretLoading && (
              <span className="text-blue-500 text-xs animate-pulse">
                Initializing…
              </span>
            )}
          </div>

          <div className="p-4 border-2 border-gray-100 rounded-xl focus-within:border-blue-400">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1a202c",
                    "::placeholder": { color: "#a0aec0" },
                    fontFamily: "Inter, sans-serif",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Error */}
        {cardError && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
            {cardError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={
            !stripe ||
            !clientSecret ||
            isProcessing ||
            amount < MIN_AMOUNT ||
            isSecretLoading
          }
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isProcessing || !clientSecret || amount < MIN_AMOUNT
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          }`}
        >
          {isProcessing ? (
            <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span>
          ) : (
            <>
              <FaLock className="text-sm" />
              Pay ${amount}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
