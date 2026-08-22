"use server";

import prisma from "../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TaskStatus } from "./generated/prisma/enums";

export type FormState =
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: boolean;
      error?: undefined;
    }
  | null
  | undefined;

const TaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Task title cannot be empty or too short" })
    .max(100, {
      message: "Task title is too long (max 100 chars)",
    })
    .trim(),
  description: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.string().optional(),
  ),
});

export async function addTask(prevState: FormState, formData: FormData) {
  const rawTitle = formData.get("title")?.toString().trim();
  const rawDes = formData.get("description")?.toString().trim();

  if (!rawTitle || rawTitle === "") {
    return {
      error: "Task title cannot be empty or too short",
    };
  }
  const validateFields = TaskSchema.safeParse({
    title: rawTitle,
    description: rawDes || undefined,
  });

  if (!validateFields.success) {
    const tree = z.flattenError(validateFields.error);

    return {
      error:
        tree.fieldErrors.title?.[0] ||
        "Task title cannot be empty or too short",
    };
  }

  const { title, description } = validateFields.data;

  try {
    await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: TaskStatus.IN_PROGRESS,
        completed: false,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to save Task", error);
    return {
      error: "An unexpected server database error occurred",
    };
  }
}

// call this inside a client-side event handler, like a checkbox's onChange event
export async function toggleTask(id: string, completed: boolean) {
  try {
    await prisma.task.update({
      where: { id },
      data: {
        completed,
        status: completed ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to toggle task", error);
  }
}
