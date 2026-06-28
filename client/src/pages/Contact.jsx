import { useState } from "react";
import contactBg from "../assets/images/foodTable.webp";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
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

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                className="input input-bordered w-full"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="Enter your phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                className="input input-bordered w-full"
                placeholder="What is this about?"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />

              <textarea
                rows="5"
                className="textarea h-10 resize-none textarea-bordered h-fixed w-full"
                placeholder="Write your message here..."
                name="message"
                value={formData.message}
                onChange={handleChange}
              />

              <button className="btn btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;