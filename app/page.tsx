import prisma from "@/lib/db";
import { addTask } from "./actions";
import TaskItem from "./component/TaskItem";
import AddTaskForm from "./component/AddTaskForm";

export async function getTasks() {
  return prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function Home() {
  const tasks = await getTasks();
  return (
    <main className="flex justify-center align-top py-10">
      <div className="flex justify-top align-center flex-col mx-auto border-blue-500 border h-125 px-16 py-8 rounded bg-blue-500/5">
        <h1 className="font-bold md:text-4xl text-2xl lg:text-5xl text-center mb-8">
          Task Managment App
        </h1>
        <AddTaskForm />
      
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              <TaskItem task={{
                ...t,
                createdAt: t.createdAt.toISOString(),
                updatedAt: t.updatedAt.toISOString(),
              }} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
