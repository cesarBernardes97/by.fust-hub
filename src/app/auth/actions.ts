"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getHubSiteUrl } from "@/utils/supabase/cookieDomain";
import { RETURN_PARAM, resolveReturnUrl } from "@/lib/returnUrl";

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

  /*
   * Destino de volta depois da confirmacao do e-mail (M-18). Quem chega de um
   * modulo vem com `?next=...`; sem isto, quem se cadastrava a partir do
   * radier confirmava o e-mail e caia no hub sem porta de volta. O valor passa
   * pelo mesmo resolveReturnUrl do login, e o /auth/callback valida de novo.
   */
  const destino = resolveReturnUrl(formData.get(RETURN_PARAM) as string | null, "");
  const callback = `${getHubSiteUrl()}/auth/callback`;
  const emailRedirectTo = destino
    ? `${callback}?${RETURN_PARAM}=${encodeURIComponent(destino)}`
    : callback;

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo,
      data: {
        full_name: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
      },
    },
  });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  return {};
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getHubSiteUrl()}/redefinir-senha`,
  });

  if (error) return { error: translateAuthError(error.message) };
  return {};
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: translateAuthError(error.message) };
  return {};
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
