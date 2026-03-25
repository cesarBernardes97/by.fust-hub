import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) redirect("/painel");

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <AuthForm type="login" />
    </main>
  );
}
