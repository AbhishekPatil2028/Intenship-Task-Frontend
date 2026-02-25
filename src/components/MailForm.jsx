import { useState } from "react";

export default function MailForm() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.to || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: "All fields are required" });
      return;
    }

    try {
      setLoading(true);
      setStatus({});

      const res = await fetch("http://localhost:5000/api/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus({ type: "success", message: "Email sent successfully 🚀" });
      setFormData({ to: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Send Email
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="to"
            placeholder="Recipient Email"
            value={formData.to}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="subject"
            placeholder="Email Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="message"
            rows="4"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>

        {status.message && (
          <p
            className={`mt-4 text-center font-medium ${
              status.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}