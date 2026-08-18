import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-xl font-semibold">Office Admin — Sign in</h1>
      <p className="max-w-sm text-center text-sm text-zinc-600 dark:text-zinc-400">
        One shared account for all office staff (see docs/SETUP.md step 2 to create it).
      </p>
      <LoginForm />
    </main>
  );
}
