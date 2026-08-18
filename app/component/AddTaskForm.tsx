'use client'
import { useActionState } from "react"
import { addTask } from "../actions"

export default function AddTaskForm() {
    const [state, formAction, isPending] = useActionState(addTask, null)
  return (
      <form action={formAction} className="pb-8">
          <div className="flex gap-1.5 w-full">
            <input
              type="text"
              name="title"
              disabled={isPending}
              placeholder="Add new Task... "
              className="border rounded px-4 py-2 outline-none focus:ring focus:ring-blue-500 bg-white"
              required
            />
            <button
              type="submit"
              disabled={isPending}
              className=" rounded-lg px-4 py-2 bg-blue-500 text-sumibold text-white outline-none focus:ring focus:ring-blue-500 cursor-pointer"
            >
             {isPending ? 'Adding..' : 'Add'}
            </button>
          </div>
            {state?.error && (
        <p className="text-sm text-red-500 font-medium mt-1">{state.error}</p>
      )}
        </form>
  )
}
