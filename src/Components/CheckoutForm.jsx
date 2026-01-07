import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCreditCard, FaLock, FaDollarSign } from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";

const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [amount, setAmount] = useState(5);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSecretLoading, setIsSecretLoading] = useState(false);

  // ১. পেমেন্ট ইনটেন্ট তৈরি করা (সংশোধিত useEffect)
  useEffect(() => {
    if (amount >= 5) {
      setIsSecretLoading(true);
      const delayDebounceFn = setTimeout(() => {
        axios
          .post(`${SERVER_BASE_URL}/api/create-payment-intent`, {
            price: amount,
          })
          .then((res) => {
            if (res.data?.clientSecret) {
              setClientSecret(res.data.clientSecret);
            }
            setIsSecretLoading(false);
          })
          .catch((err) => {
            console.error("Stripe Secret Error:", err);
            setIsSecretLoading(false);
            // match error রোধ করতে console error হ্যান্ডলিং
          });
      }, 700); // Debounce সময় একটু বাড়ানো হয়েছে

      return () => clearTimeout(delayDebounceFn);
    } else {
      setClientSecret("");
    }
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setIsProcessing(true);
    setCardError("");

    try {
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
      } else if (paymentIntent.status === "succeeded") {
        toast.success(`$${amount} পেমেন্ট সফল হয়েছে!`);
        onPaymentSuccess(paymentIntent.id, amount);
      }
    } catch (err) {
      setCardError("পেমেন্ট সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            সহযোগিতার পরিমাণ ($)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaDollarSign className="text-blue-500" />
            </div>
            <input
              type="number"
              min="5"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="pl-9 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-600 text-sm font-medium">
            <div className="flex items-center gap-2">
              <FaCreditCard /> <span>কার্ডের তথ্য প্রদান করুন</span>
            </div>
            {isSecretLoading && (
              <span className="text-blue-500 text-xs animate-pulse">
                Initializing...
              </span>
            )}
          </div>

          <div className="p-4 border-2 border-gray-100 rounded-xl bg-white focus-within:border-blue-300 transition-all">
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

        {cardError && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 italic">
            {cardError}
          </div>
        )}

        <button
          type="submit"
          disabled={
            !stripe ||
            !clientSecret ||
            isProcessing ||
            amount < 5 ||
            isSecretLoading
          }
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
            isProcessing || !clientSecret || amount < 5 || isSecretLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg"
          }`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
