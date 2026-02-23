import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050814]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-2">
            Sign in to manage your portfolio
          </p>
        </div>
        <SignIn
          forceRedirectUrl="/admin/dashboard"
          appearance={{
            elements: {
              card: "bg-white/5 border border-white/10 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              socialButtonsBlockButton:
                "border border-white/20 bg-white/5 text-white hover:bg-white/10",
              dividerLine: "bg-white/10",
              dividerText: "text-white/40",
              formFieldLabel: "text-white/70",
              formFieldInput: "bg-white/5 border-white/20 text-white",
              footerActionLink: "text-emerald-400 hover:text-emerald-300",
              formButtonPrimary:
                "bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90",
            },
          }}
        />
      </div>
    </main>
  );
}
