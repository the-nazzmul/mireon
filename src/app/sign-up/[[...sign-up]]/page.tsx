import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#f97316ff" },
        }}
      />
    </div>
  );
}
