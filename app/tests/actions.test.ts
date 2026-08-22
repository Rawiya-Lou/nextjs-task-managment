// @vitest-environment node
import { dbMock } from "../../lib/__mocks__/db";
import { addTask } from "../actions";
import {act} from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidatePath } from "next/cache";

import { TaskStatus } from "../generated/prisma/enums";


// Mock Next.js cache revalidation utility so it doesn't crash outside of a server environment

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("server actions suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("addTask: should save valid task with optinal description", async () => {
    // 1. Build synthetic FormData matching a browser payload

    const formData = new FormData();

    formData.append("title", "Complete CI/CD setup");

    formData.append("description", "Use GitHub Actions and Node 24");
    // 2. Program mock to resolve successfully on creation

    dbMock.task.create.mockResolvedValue({
      id: "task-2",
      title: "Complete CI/CD setup",
      description: "Use GitHub Actions and Node 24",
      completed: false,
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let result;
    await act(async () => {
      result = await addTask(null, formData);
    });

    expect(dbMock.task.create).toHaveBeenCalledWith({
      data: {
        title: "Complete CI/CD setup",
        description: "Use GitHub Actions and Node 24",
        completed: false,
        status: TaskStatus.IN_PROGRESS,
      },
    });

    expect(result).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("addTask: should return validation error and not call Prisma if title is too short", async () => {
    const formData = new FormData();

    formData.append("title", "Hi");

    let result;
    await act(async () => {
      result = await addTask(null, formData);
    });
    expect(dbMock.task.create).not.toHaveBeenCalled();

    expect(result).toEqual({
      error: "Task title cannot be empty or too short",
    });
  });
  it("addTask: should reject titles that exceed 100 charachters", async () => {
    const formData = new FormData();

    formData.append("title", "A".repeat(101));

    let result;
    await act(async () => {
      result = await addTask(null, formData);
    });
    expect(dbMock.task.create).not.toHaveBeenCalled();

    expect(result).toEqual({
      error: "Task title is too long (max 100 chars)",
    });
  });

  it("addTask: should return a fallback error if the title field is missing", async () => {
    const formData = new FormData();

    let result;
    await act(async () => {
      result = await addTask(null, formData);
    });
    expect(dbMock.task.create).not.toHaveBeenCalled();

    expect(result).toEqual({
      error: "Task title cannot be empty or too short",
    });
  });

  it("addTask: should handle Prisma runtime expection", async () => {
    const formData = new FormData();

    formData.append("title", "valid title setup");
    formData.append("description", "Valid optional description text content");

    // 1. Force the prisma mock to throw an explicit error

    dbMock.task.create.mockRejectedValue(
      new Error("Database connection timeout"),
    );
    // 2. Spy on console.error so your test output stays clean
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    let result;
    await act(async () => {
      result = await addTask(null, formData);
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to save Task",
      expect.any(Error),
    );

    expect(result).toEqual({
      error: "An unexpected server database error occurred",
    });

    consoleSpy.mockRestore();
  });
});
