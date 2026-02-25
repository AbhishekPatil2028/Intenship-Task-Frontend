import { createContext, useContext } from "react";
import taskData from "../data/tasks.json";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  return (
    <TaskContext.Provider value={taskData}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
