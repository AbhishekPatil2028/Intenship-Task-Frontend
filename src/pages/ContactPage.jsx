import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createContact, getContacts, updateContact } from "../api/formApi";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (id) {
      getContacts().then((res) => {
        const record = res.data.find((x) => x._id === id);
        setEditData(record);
      });
    }
  }, [id]);

  const handleSubmit = async (data) => {
    if (id) await updateContact(id, data);
    else await createContact(data);

    navigate("/contacts");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <ContactForm editData={editData} onSubmit={handleSubmit} />
    </div>
  );
}
