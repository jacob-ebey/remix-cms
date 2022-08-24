export async function countContent({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 0;
}
