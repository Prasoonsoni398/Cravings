import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const faqs = [
  ["How do I track my order?", "Go to your dashboard and open the active order to see live tracking."],
  ["How do I get a refund?", "Submit a ticket with your Order ID and our team will process it within 2-3 business days."],
  ["My rider is late. What do I do?", "You can contact your rider directly via the order page or raise a support ticket."],
  ["How do I update my account info?", "Navigate to your dashboard settings to update your profile details."],
];

const issueTypes = ["Account & Profile", "Order Issues", "Payment & Billing", "Delivery Problem", "Restaurant / Menu", "Other"];

const HelpCenter = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <main className="flex min-h-[90vh] items-center justify-center bg-[url('/HelpPage.jpg')] bg-cover bg-center p-6 md:p-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-black/60 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 px-10 pb-4 pt-8">
          <FaQuestionCircle className="text-2xl text-primary" />
          <h1 className="text-3xl font-bold text-primary">Help Center</h1>
        </div>
        <p className="mb-6 px-10 text-center text-(--color-secondary-content)">Browse FAQs or submit a support ticket below.</p>
        <div className="flex flex-col divide-y divide-gray-200/80 px-0 md:flex-row md:divide-x md:divide-y-0">
          <div className="px-8 pb-8 md:w-1/2 md:px-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-neutral-content)">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-2">
              {faqs.map(([question, answer], index) => (
                <div key={question} className="overflow-hidden rounded-md border border-base-100">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-(--color-neutral-content) transition hover:bg-base-100/50"
                  >
                    {question}
                    <span>{activeFaq === index ? "-" : "+"}</span>
                  </button>
                  {activeFaq === index && (
                    <p className="bg-base-100/30 px-4 pb-3 text-sm text-(--color-secondary-content)">{answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="px-8 pb-8 md:w-1/2 md:px-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-(--color-neutral-content)">Submit a Support Ticket</h2>
            {submitted && (
              <p className="mb-4 rounded-md bg-(--color-success) px-3 py-2 text-sm font-semibold text-white">
                Support ticket submitted. We'll reach out within 24 hours.
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <input className="mb-4 w-full rounded-md border border-(--color-base-300) bg-base-100/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your full name" required />
              <input type="email" className="mb-4 w-full rounded-md border border-(--color-base-300) bg-base-100/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" required />
              <select className="mb-4 w-full rounded-md border border-(--color-base-300) bg-base-100/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" required>
                <option value="">Select issue type</option>
                {issueTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <input className="mb-4 w-full rounded-md border border-(--color-base-300) bg-base-100/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. ORD-00123" />
              <textarea className="mb-6 w-full resize-none rounded-md border border-(--color-base-300) bg-base-100/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" rows={4} placeholder="Please describe the problem in detail..." required />
              <button className="w-full rounded-md bg-primary py-3 font-semibold text-white transition hover:bg-orange-700">
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HelpCenter;
