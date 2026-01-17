import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Container from "../Components/Container";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;

    // সিম্পল ভ্যালিডেশন চেক
    if (name && email && message) {
      console.log({ name, email, message });
      toast.success("Message sent successfully! We will contact you soon.");
      form.reset();
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  return (
    <div className="bg-base-100 dark:bg-slate-950 min-h-screen py-16 transition-colors duration-300">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white mb-4 tracking-tight">
            Get In <span className="text-secondary">Touch</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Have questions about our social events or want to collaborate? Reach
            out to us, and our team will get back to you within 24 hours.
          </p>
          <div className="h-1.5 w-20 bg-secondary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="card-pro p-8 flex items-start gap-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white">Call Us</h3>
                <p className="text-slate-500 text-sm">+880 1234 567 890</p>
              </div>
            </div>

            <div className="card-pro p-8 flex items-start gap-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white">Email Us</h3>
                <p className="text-slate-500 text-sm">
                  support@sdep-platform.com
                </p>
              </div>
            </div>

            <div className="card-pro p-8 flex items-start gap-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white">Visit Us</h3>
                <p className="text-slate-500 text-sm">
                  Level 4, Social Hub, Dhaka, Bangladesh
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-4 flex justify-center gap-6">
              <a
                href="#"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-pro p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-8 dark:text-white">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className="input-pro"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="input-pro"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="input-pro"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Write your message here..."
                    className="input-pro resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-pro w-full md:w-max py-4 px-10"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactUs;
