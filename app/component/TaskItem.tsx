"use client";

import { useTransition } from "react";
import { toggleTask } from "../actions";
import { Task } from "../generated/prisma/client";
// This automatically maps Date types to Strings to match what the browser actually receives
interface TaskItemProps {
  task: Omit<Task, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
}
export default function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex  gap-2 justify-between my-4">
        <div className="flex gap-2 justify-between">
      <input
        type="checkbox"
        checked={task.completed}
        disabled={isPending}
        onChange={(e) =>
          // Server actions inside event handlers must be wrapped in startTransition
          startTransition(async () => {
            await toggleTask(task.id, e.target.checked);
          })
        }
      />
      <div className="flex flex-col justify-start">

      <h2>{task.title}</h2>
      {task.description && <p>{task.description}</p>}
      </div>

        </div>
    <span className={`text-xs px-2 py-0.5 rounded font-mono transition-colors ${
  isPending 
    ? 'bg-gray-100 text-gray-500 animate-pulse' 
    : task.status === 'DONE' 
    ? 'bg-green-100 text-green-800' 
    : task.status === 'IN_REVIEW' 
    ? 'bg-yellow-100 text-yellow-800' 
    : 'bg-blue-100 text-blue-800' // IN_PROGRESS fallback
}`}>
  
  {isPending ? 'SAVING...' : task.status.replace('_', ' ')}
</span>
      
    </div>
  );
}
