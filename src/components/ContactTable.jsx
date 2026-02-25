export default function ContactTable({ data, onEdit, onDelete }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="th">Name</th>
          <th className="th">Email</th>
          <th className="th">Subject</th>
          <th className="th">Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="border-t">
            <td className="td">{item.name}</td>
            <td className="td">{item.email}</td>
            <td className="td">{item.subject}</td>
            <td className="td space-x-2">
              <button
                onClick={() => onEdit(item._id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
