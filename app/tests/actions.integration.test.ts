// app/tests/actions.integration.test.ts
// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolve } from "path";
import process  from "node:process";

// 1. FIXED: Mock Next.js cache revalidation utility so it doesn't crash during integration runs
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

try {
  (process).loadEnvFile(resolve(process.cwd(), ".env.test"));
} catch (e) {
  console.warn("Could not find .env.test file natively.", e);
}

// Ensure database files are unmocked for the real database connection
vi.unmock("../../lib/db");
vi.unmock("@/lib/db");

import realPrismaInstance from "@/lib/db"; 

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
