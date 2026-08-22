import { beforeEach, vi } from "vitest";
import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "../../app/generated/prisma/client";
// reset mock tracking between tests
beforeEach(() => {
  mockReset(dbMock);
});

export const dbMock =
  mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

vi.mock("../db", () => ({
  default: dbMock,
  prisma: dbMock,
}));
vi.mock("@/lib/db", () => ({
  default: dbMock,
  prisma: dbMock,
}));
