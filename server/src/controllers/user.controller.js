import prisma from "../config/prisma.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { workouts: true },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
