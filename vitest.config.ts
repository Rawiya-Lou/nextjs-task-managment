import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"), // Shared across all sub-projects
    },
  },
  test: {
    // 1. GLOBAL BASE SETTINGS (Root Level)
    globals: true,
    fileParallelism: false,
    isolate: true,
    onConsoleLog: () => {
      if (typeof window !== "undefined" && global.Event !== window.Event) {
        global.Event = window.Event;
      }
    },

    // 2. FIXED: Move coverage completely out of the sub-project to this root level
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "json"],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
      include: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "coverage/**",
        "vitest.config.**",
        "vitest.setup.**",
        "app/layout.tsx",
        "app/tests/**", // Prevents integration test files from lowering unit metrics
        "lib/db.ts",
        "lib/__mocks__/**",
        "**/*.d.ts",
      ],
      skipFull: true,
    },

    // 3. REGULAR PROJECT ISOLATION DEFINITIONS
    projects: [
      {
        extends: true, // Inherits root aliases and root coverage settings safely
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["app/**/*.test.{ts,tsx}"],
          // FIX: Explicitly ignore integration files inside the unit project run
          exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/.next/**",
            "**/*.integration.test.ts"
          ],
          setupFiles: ["./vitest.setup.ts"], // Mocks Prisma for unit runs
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node", // Fast server-side backend environment
          include: ["app/tests/**/*.integration.test.ts"],
          exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/.next/**"
          ],
          // No setupFiles are used here, allowing Prisma to hit your real test DB
        },
      },
    ],
  },
});
