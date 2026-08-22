// app/tests/actions.integration.test.ts
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolve } from "path";
import process from "node:process";

// Mock Next.js cache revalidation utility so it doesn't crash during integration runs
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

try {
  process.loadEnvFile(resolve(process.cwd(), ".env.test"));
} catch (e) {
  console.warn("Could not find .env.test file natively.", e);
}

// Ensure database files are unmocked for the real database connection
vi.unmock("../../lib/db");
vi.unmock("@/lib/db");

import realPrismaInstance from "@/lib/db";
import { TaskStatus } from "../generated/prisma/enums";
import { toggleTask } from "../actions";
import { getTasks } from "../queries/getTasks"; 

describe("addTask: Integration test", () => {
  beforeEach(async () => {
    await realPrismaInstance.task.deleteMany({});
  });

  it("should actually write the task into a real database", async () => {
    const formData = new FormData();
    formData.append("title", "Real Integration Task");

    const { addTask } = await import("../actions");

    // Act
    const result = await addTask(null, formData);

    // Assert success object returned from your active try block!
    expect(result).toEqual({
      success: true,
    });

    // Confirm data actually landed on your cloud Neon PostgreSQL instance
    const savedTask = await realPrismaInstance.task.findFirst({
      where: { title: "Real Integration Task" },
    });

    expect(savedTask).not.toBeNull();
    expect(savedTask?.title).toBe("Real Integration Task");
    expect(savedTask?.completed).toBe(false);
  });
});

describe("toggleTask: Integration Test for updating the db", () => {
  beforeEach(async () => {
    await realPrismaInstance.task.deleteMany({});
  });

  it("should update a task status to Done in the live db", async () => {
    const createTask = await realPrismaInstance.task.create({
      data: {
        title: "Integration Testing Task",
        status: TaskStatus.IN_PROGRESS,
        completed: false,
      },
    });

    await toggleTask(createTask.id, true);

    const updateTask = await realPrismaInstance.task.findUnique({
      where: { id: createTask.id },
    });
    expect(updateTask).toBeDefined();
    expect(updateTask?.completed).toBe(true);
    expect(updateTask?.status).toBe(TaskStatus.DONE);
  });

  it("should revert a task status back to IN_PROGRESS when toggled to false", async () => {
    const createTask = await realPrismaInstance.task.create({
      data: {
        title: "Integration Testing Task",
        status: TaskStatus.DONE,
        completed: true,
      },
    });

    await toggleTask(createTask.id, false);

    const updateTask = await realPrismaInstance.task.findUnique({
      where: { id: createTask.id },
    });

    expect(updateTask).toBeDefined();
    expect(updateTask?.completed).toBe(false);
    expect(updateTask?.status).toBe(TaskStatus.IN_PROGRESS);
  });
});

describe("getTasks: Integration test to get the tasks from db", () => {
  beforeEach(async () => {
    await realPrismaInstance.task.deleteMany();
  });

  it("should connect to Neon to retrieve row sorted by descending order", async () => {
    const oldTask = await realPrismaInstance.task.create({
      data: {
        title: "Older Task entry",
        createdAt: new Date("2026-05-10T10:00:00Z"),
      },
    });

    const newTask = await realPrismaInstance.task.create({
        data: {
        title: 'Newer Task entry',
        createdAt: new Date('2026-05-10T12:00:00Z'), // 2 hours newer
      },
    })

    const tasks = await getTasks();

    expect(tasks.length).toBe(2);
    expect(tasks[0].id).toBe(newTask.id)
    expect(tasks[1].id).toBe(oldTask.id)
    expect(tasks[0].title).toBe('Newer Task entry')
  });
});
