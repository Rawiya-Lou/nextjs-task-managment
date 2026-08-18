"use server";

import prisma from "../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TaskStatus } from "./generated/prisma/enums";

export type FormState = {
   
    error: string;
    success?: undefined;
} | {
    success: boolean;
    error?: undefined;
} | null | undefined

const TaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Task title cannot be empty" })
    .max(100, {
      message: "Task title is too long (max 100 chars)",
    })
    .trim(),
    description: z.string().optional().nullable()
});

export async function addTask(prevState: FormState, formData: FormData) {
  const validateFields = TaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description")
  });

  if (!validateFields.success) {
    const tree = z.flattenError(validateFields.error);
  

    return {
      error:
        tree.fieldErrors.title?.[0] ||
        "Invalid input",
    };
  }

  const { title, description } = validateFields.data;

  try {
    await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: TaskStatus.IN_PROGRESS,
        completed: false
       },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to save Task", error)
    
  }
}

// call this inside a client-side event handler, like a checkbox's onChange event
export async function toggleTask(id: string, completed: boolean) {
  try {
    await prisma.task.update({
      where: { id },
      data: { completed, 
        status: completed ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
       },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to toggle task", error);
  }
}
