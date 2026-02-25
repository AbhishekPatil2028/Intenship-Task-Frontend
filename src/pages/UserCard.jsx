import { useNavigate } from "react-router-dom";
import users from "../data/users.json";

export default function UserCard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4">

      <div className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
  
  {/* Back Button */}
  <button
    onClick={() => navigate("/")}
    className="
      flex items-center gap-2 
      text-blue-600 
      font-medium 
      hover:text-blue-800 
      transition
    "
  >
    ← Back
  </button>

  {/* Heading */}
  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center flex-1">
    Team Members
  </h2>

  {/* Spacer for perfect centering */}
  <div className="w-16"></div>
</div>


      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="
              bg-white 
              rounded-2xl 
              p-6 
              text-center 
              shadow-md 
              hover:shadow-2xl 
              transition-all 
              duration-300 
              hover:-translate-y-2
            "
          >
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={user.image}
                alt={user.name}
                className="
                  w-28 h-28 
                  rounded-full 
                  object-cover 
                  ring-4 
                  ring-blue-100
                "
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-800">
              {user.name}
            </h3>

            <p className="text-blue-600 text-sm font-medium mt-1">
              {user.role}
            </p>

            <div className="w-12 h-1 bg-blue-500 mx-auto my-4 rounded-full"></div>

            <button
              className="
                mt-2 
                px-5 
                py-2 
                text-sm 
                font-medium 
                text-white 
                bg-blue-600 
                rounded-lg 
                hover:bg-blue-700 
                transition
              "
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
