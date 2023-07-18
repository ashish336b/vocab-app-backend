import { prisma } from '../../core/db/db';

export const getUser = async (email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return await prisma.user.create({ data: { email } });
  }

  return user;
};
