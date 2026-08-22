import prisma from "@/lib/db";

export async function getTasks() {
    try {
          return prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
        
    } catch (error) {
        console.error("Db query exception [getTasks]: ", error)

        return []
        
    }

}