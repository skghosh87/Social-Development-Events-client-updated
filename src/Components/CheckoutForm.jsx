import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCreditCard, FaLock, FaDollarSign } from "react-icons/fa";

const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(5); // ডিফল্ট ৫ ডলার
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // পেমেন্ট ইনটেন্ট তৈরি করা (যখনই অ্যামাউন্ট ৫ বা তার বেশি হবে)
  useEffect(() => {
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
          });
      }, 500); // ইউজার টাইপ করা শেষ করার জন্য ৫০০ms অপেক্ষা

      return () => clearTimeout(delayDebounceFn);
    }
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (amount < 5) {
      setCardError("নূন্যতম ৫ ডলার পেমেন্ট করতে হবে।");
      return;
    }

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setIsProcessing(true);
    setCardError("");

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: { name: "Donor" },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setIsProcessing(false);
    } else {
      if (paymentIntent.status === "succeeded") {
        toast.success(`$${amount} পেমেন্ট সফল হয়েছে!`);
        onPaymentSuccess(paymentIntent.id, amount);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* অ্যামাউন্ট ইনপুট ফিল্ড */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            আপনি কত ডলার দিতে চান? (নূন্যতম $৫)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaDollarSign className="text-gray-400" />
            </div>
            <input
              type="number"
              min="5"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="pl-8 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="অ্যামাউন্ট লিখুন"
              required
            />
          </div>
          {amount > 0 && amount < 5 && (
            <p className="text-red-500 text-xs mt-1">
              দয়া করে ৫ বা তার বেশি লিখুন।
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
          <FaCreditCard className="text-blue-600" />
          <span>কার্ডের তথ্য দিন</span>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
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
          <p className="text-red-500 text-sm font-medium">{cardError}</p>
        )}

        <button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing || amount < 5}
          className={`w-full py-3 px-6 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center gap-2 ${
            isProcessing || !stripe || amount < 5
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg"
          }`}
        >
          {isProcessing ? "প্রসেসিং..." : `Pay $${amount} & Confirm`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
