"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

function translateAuthError(message: string): string {
  if (!message) return "Ocorreu um erro desconhecido.";
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "E-mail ainda não confirmado. Verifique sua caixa de entrada.";
  if (m.includes("user already registered")) return "Este e-mail já está cadastrado.";
  if (m.includes("password should be at least")) return "A senha deve ter no mínimo 6 caracteres.";
  if (m.includes("for security purposes") && m.includes("after")) {
    const sec = message.match(/\d+ seconds/);
    return `Por segurança, aguarde ${sec ? sec[0].replace("seconds", "segundos") : "alguns segundos"}.`;
  }
  if (m.includes("rate limit")) return "Muitas tentativas. Tente novamente mais tarde.";
  if (m.includes("network") || m.includes("fetch")) return "Erro de conexão. Verifique sua rede.";

  return "Erro: " + message;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  return {};
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: { full_name: formData.get("fullName") as string },
    },
  });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  return {};
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
