import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinPage = async (props: Props) => {
  const { projectId } = await props.params;
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: `/join/${projectId}` });
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!dbUser) {
    await db.user.create({
      data: {
        id: userId,
        emailAddress: user.emailAddresses[0]!.emailAddress,
        firstName: user.firstName!,
        lastName: user.lastName!,
        imageUrl: user.imageUrl,
      },
    });
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  try {
    await db.userToProject.create({
      data: {
        projectId: projectId,
        userId: userId,
      },
    });
  } catch {
    console.log("User is already in the project");
  }
  return redirect(`/dashboard`);
};

export default JoinPage;
