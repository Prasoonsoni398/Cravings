import { useState } from "react";
import { useNavigate } from "react-router-dom";
import contactBg from "../assets/images/foodTable.webp";
import api from "../config/api.config.js";

function Contact() {
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [validateError, setValidateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fullName: contactData.fullName,
      email: contactData.email.toLowerCase(),
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    };

    try {
      const res =await api.post("/public/contact", payload);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="relative h-[91vh] w-full overflow-hidden">
      {/* Background */}
      <img
        src={contactBg}
        alt="Contact Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Contact Card */}
      <div className="absolute left-[6%] top-1/2 -translate-y-1/2">
        <div className="card w-[480px] bg-base-100 shadow-2xl">
          <div className="card-body p-8">
            <h1 className="text-center text-4xl font-bold text-primary">
              Contact Us
            </h1>

            <p className="mb-6 text-center text-secondary">
              Have a question? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="input input-bordered w-full"
                value={contactData.fullName}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={contactData.email}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                className="input input-bordered w-full"
                value={contactData.phone}
                onChange={handleChange}
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="input input-bordered w-full"
                value={contactData.subject}
                onChange={handleChange}
              />

              <textarea
                rows={5}
                name="message"
                placeholder="Write your message here..."
                className="textarea h-25 resize-none textarea-bordered w-full"
                value={contactData.message}
                onChange={handleChange}
              />

              {validateError && (
                <p className="text-sm text-error text-center">
                  {validateError}
                </p>
              )}

              {successMessage && (
                <p className="text-sm text-success text-center">
                  {successMessage}
                </p>
              )}

              <button type="submit" className="btn btn-primary w-full">
                Send Message
              </button>
            </form>

            <div className="divider"></div>

            <p className="text-center text-secondary">
              Want to order delicious food?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-primary hover:underline"
              >
                Login
              </button>
              {" | "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-primary hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
