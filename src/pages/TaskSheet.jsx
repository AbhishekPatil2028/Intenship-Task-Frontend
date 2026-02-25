import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";

export default function TaskSheet() {
  const { owner, tasks } = useTaskContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        {owner} Abhishek Patil - Daily Task
      </h1>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
          
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-3">
                {task.title}

                {task.status === "completed" ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Pending
                  </span>
                )}
              </h2>

              <p className="text-gray-500 text-sm">{task.date}</p>
            </div>

            <button
              onClick={() => navigate(task.route)}
              disabled={task.status !== "completed"}
              className={`
                px-5 py-2 rounded-lg text-white transition
                ${
                  task.status === "completed"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
