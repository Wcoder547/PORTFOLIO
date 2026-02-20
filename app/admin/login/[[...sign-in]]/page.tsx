import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignIn
        routing="path"
        path="/admin/login"
        signUpUrl="/admin/login"
        fallbackRedirectUrl="/admin/dashboard"
        forceRedirectUrl="/admin/dashboard"
      />
    </div>
  );
}
