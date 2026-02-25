import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const initialState = {
  name: "",
  email: "",
  subject: "",
  message: ""
};



export default function ContactForm({ editData, onSubmit }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 3)
      newErrors.name = "Minimum 3 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.subject.trim()) newErrors.subject = "Subject is required";

    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 5)
      newErrors.message = "Minimum 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim()
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-4">
      
      {/* CARD */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-10">
            
            {/* BACK BUTTON */}
  <button
    type="button"
    onClick={() => navigate("/contacts")}
    className="mb-6 text-blue-600 hover:underline text-sm"
  >
    ← Back to Contact List
  </button>

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Contact Us
          </h1>
          <p className="text-gray-500 mt-2">
            We'd love to hear from you. Please fill out this form.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submitForm} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {editData ? "Update Contact" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
