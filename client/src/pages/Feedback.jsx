import { useState } from "react";
import { FaStar } from "react-icons/fa";


const categories = ["Food Quality", "Delivery Experience", "App & Website", "Customer Support", "Pricing & Value"];

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setRating(0);
    event.currentTarget.reset();
  };

  return (
    <main className="flex h-[90vh] items-center justify-end bg-[url('/FeedbackPage.jpeg')] bg-cover bg-center p-6 md:p-10 md:pe-30">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-base-100 px-8 py-6 shadow-md md:px-10">
        <h1 className="mb-2 text-center text-3xl font-bold text-primary">Share Feedback</h1>
        <p className="mb-5 text-center text-secondary">Help us improve your Cravings experience.</p>
        {submitted && (
          <p className="mb-4 rounded-md bg-(--color-success) px-3 py-2 text-sm font-semibold text-white">
            Thank you for your feedback.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block font-semibold text-(--color-neutral)">Full Name</label>
          <input className="mb-4 w-full rounded-md border border-(--color-base-300) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your full name" required />

          <label className="mb-2 block font-semibold text-(--color-neutral)">Email</label>
          <input type="email" className="mb-4 w-full rounded-md border border-(--color-base-300) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" required />

          <label className="mb-2 block font-semibold text-(--color-neutral)">Feedback Category</label>
          <select className="mb-4 w-full rounded-md border border-(--color-base-300) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <div className="mb-4 flex items-center gap-6">
            <label className="font-semibold text-(--color-neutral)">Overall Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="text-2xl">
                  <FaStar className={star <= rating ? "bg-warningg" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>

          <label className="mb-2 block font-semibold text-(--color-neutral)">Your Feedback</label>
          <textarea className="mb-6 w-full resize-none rounded-md border border-(--color-base-300) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Tell us about your experience..." required />

          <button className="w-full rounded-md bg-primary py-3 font-semibold text-white transition hover:bg-orange-700">
            Submit Feedback
          </button>
        </form>
      </div>
    </main>
  );
};

export default Feedback;
