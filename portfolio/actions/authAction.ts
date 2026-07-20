"use server";

import { createSession, deleteSession, validateCredentials } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!name || !password || !validateCredentials(name, password)) redirect("/connexion?erreur=identifiants");
  await createSession();
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/connexion");
}
