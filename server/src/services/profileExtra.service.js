import prisma from "../config/prisma.js";

/**
 * Fetch highlight note and recent todos for user panel.
 */
export async function getUserPanelData(userId) {
  const [note, todos] = await Promise.all([
    prisma.highlightNote.findUnique({ where: { userId } }),
    prisma.weeklyTodo.findMany({
      where: {
        userId,
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 8)),
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { note, todos };
}

/**
 * Create or update highlight note.
 */
export async function upsertNote(userId, title, text) {
  return prisma.highlightNote.upsert({
    where: { userId },
    update: { title, text },
    create: { userId, title, text },
  });
}

/**
 * Delete highlight note.
 */
export async function deleteNote(userId) {
  return prisma.highlightNote.delete({ where: { userId } });
}

/**
 * Create a weekly todo.
 */
export async function createTodo(userId, text, date) {
  return prisma.weeklyTodo.create({
    data: {
      userId,
      text,
      date: new Date(date),
      isCompleted: false,
    },
  });
}

/**
 * Toggle todo completion status.
 * Returns null if todo not found or not owned by user.
 */
export async function toggleTodo(userId, id) {
  const existing = await prisma.weeklyTodo.findUnique({ where: { id } });

  if (!existing || existing.userId !== userId) {
    return null;
  }

  return prisma.weeklyTodo.update({
    where: { id },
    data: { isCompleted: !existing.isCompleted },
  });
}

/**
 * Delete a todo.
 * Returns null if todo not found or not owned by user.
 */
export async function deleteTodo(userId, id) {
  const existing = await prisma.weeklyTodo.findUnique({ where: { id } });

  if (!existing || existing.userId !== userId) {
    return null;
  }

  await prisma.weeklyTodo.delete({ where: { id } });
  return true;
}

/**
 * Upsert a PR slot assignment.
 */
export async function upsertPRSlot(userId, slotIndex, exerciseId) {
  return prisma.userPRSlot.upsert({
    where: {
      userId_slotIndex: { userId, slotIndex },
    },
    update: { exerciseId },
    create: { userId, slotIndex, exerciseId },
  });
}
