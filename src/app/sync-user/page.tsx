import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

//This is the page where user will be redirected after authenticating with clerk. Here I will sync the user with the DB
const SyncUser = async () => {
  // check if there is user
  const { userId } = await auth();

  //   throw error if there is not user
  if (!userId) {
    throw new Error("User not found");
  }

  const client = await clerkClient();

  const user = await client.users.getUser(userId);
  if (!user.emailAddresses[0]?.emailAddress) {
    return notFound();
  }

  await db.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: userId,
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return redirect("/dashboard");
};

export default SyncUser;
