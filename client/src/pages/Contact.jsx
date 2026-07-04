import { useState } from "react";
import api from "../config/api.config.js";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.toLowerCase().trim(),
      phone: form.phone.trim(),
      subject: form.subject,
      message: form.message,
    };


    try {
      const res = await api.post("/public/contactUs", payload);

      alert(res.data.message);

      setSent(true);
      setForm(initialForm);
      console.log(res.data.data);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };



  return (
    <main className="flex h-[90vh] items-center justify-start bg-[url('/contactPage.jpg')] bg-cover bg-center p-6 md:p-10 md:ps-30">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-base-100 px-8 py-6 shadow-md md:px-10">
        <h1 className="mb-2 text-center text-3xl font-bold text-primary">Contact Us</h1>
        <p className="mb-5 text-center text-secondary">Have a question? We'd love to hear from you.</p>
        {sent && (
          <p className="mb-4 rounded-md bg-(--color-success) px-3 py-2 text-sm font-semibold text-white">
            Message sent. We'll get back to you soon.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {[
            ["fullName", "text", "Enter your full name"],
            ["email", "email", "Enter your email"],
            ["phone", "tel", "Enter your phone number"],
            ["subject", "text", "What is this about?"],
          ].map(([name, type, placeholder]) => (
            <div key={name} className="mb-4">
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-md border border-(--color-base-300) px-3 py-2 text-sm text-(--color-neutral) placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
                required={name !== "phone"}
              />
            </div>
          ))}
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={4}
            className="mb-6 w-full resize-none rounded-md border border-(--color-base-300) px-3 py-2 text-sm text-(--color-neutral) placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button type="submit" className="w-full rounded-md bg-primary py-3 font-semibold text-white transition hover:bg-orange-700">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
