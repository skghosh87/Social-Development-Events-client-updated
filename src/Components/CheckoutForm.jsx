import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCreditCard, FaLock } from "react-icons/fa";

const SERVER_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "social-development-events-seven.vercel.app";

const CheckoutForm = ({ price, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ১. পেমেন্ট ইনটেন্ট তৈরি করা (যখনই প্রাইস থাকবে)
  useEffect(() => {
    if (price > 0) {
      axios
        .post(`${SERVER_BASE_URL}/api/create-payment-intent`, { price })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err);
        });
    }
  }, [price]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setIsProcessing(true);
    setCardError("");

    // ২. পement কনফার্ম করা
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
      return;
    }

    // ৩. স্ট্রাইপ সার্ভারের সাথে পেমেন্ট নিশ্চিত করা
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: "Donor/Organizer", // আপনি চাইলে ইউজারের নাম ডাইনামিক করতে পারেন
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setIsProcessing(false);
    } else {
      if (paymentIntent.status === "succeeded") {
        toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
        // ৪. সফল হলে ট্রানজেকশন আইডি প্যারেন্ট কম্পোনেন্টে পাঠানো
        onPaymentSuccess(paymentIntent.id);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
          <FaCreditCard className="text-blue-600" />
          <span>কার্ডের তথ্য দিন (International)</span>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 focus-within:border-blue-500 transition">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>

        {cardError && (
          <p className="text-red-500 text-sm font-medium mt-2">{cardError}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
          <FaLock className="text-green-500" />
          <span>আপনার তথ্য নিরাপদ এবং স্ট্রাইপ দ্বারা এনক্রিপ্ট করা।</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing}
          className={`w-full py-3 px-6 mt-4 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center gap-2 ${
            isProcessing || !stripe
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg"
          }`}
        >
          {isProcessing ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              প্রসেসিং হচ্ছে...
            </>
          ) : (
            `Pay $${price} & Confirm`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
