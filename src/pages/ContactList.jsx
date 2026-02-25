import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteContact, getContacts } from "../api/formApi";
import ContactTable from "../components/ContactTable";

export default function ContactList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getContacts();
    setData(res.data);
  };

  // UI only delete
  const handleDelete = async (id) => {
    await deleteContact(id);
    setData((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Contact List</h2>
        <button
          onClick={() => navigate("/contacts/new")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Contact
        </button>
      </div>

      <ContactTable
        data={data}
        onEdit={(id) => navigate(`/contacts/edit/${id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
