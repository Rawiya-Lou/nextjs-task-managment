import AddTaskForm from "./component/AddTaskForm";
import { Suspense } from "react";
import TaskList from "./component/TaskList";
import TaskListSkeleton from "./component/skeleton/TaskListSkeleton";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex justify-center align-top py-10">
      <div className="flex justify-top align-center flex-col mx-auto border-blue-500 border h-125 px-16 py-8 rounded bg-blue-500/5">
        <h1 className="font-bold md:text-4xl text-2xl lg:text-5xl text-center mb-8">
          Task Managment App
        </h1>
        <AddTaskForm />

        {/* Suspense handles asynchronous streaming seamlessly */}
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskList />
        </Suspense>
      </div>
    </main>
  );
}
