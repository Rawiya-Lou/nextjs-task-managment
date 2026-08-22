import { getTasks } from "../queries/getTasks"
import TaskItem from "./TaskItem";

export default async function TaskList() {
    const tasks = await getTasks();

     if (tasks.length === 0) {
    return (
      <p className="text-sm text-center text-gray-500 mt-8">
        No tasks found. Create one above to get started!
      </p>
    );
  }
  return (
     <ul className="space-y-3 mt-6">
      {tasks.map((task) => (
        <li key={task.id} className="list-none">
          <TaskItem 
            task={{
              ...task,
              // Convert native date stamps to transport-safe JSON strings safely
              createdAt: task.createdAt.toISOString(),
              updatedAt: task.updatedAt.toISOString(),
            }} 
          />
        </li>
      ))}
    </ul>
  )
}
