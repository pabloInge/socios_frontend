"use server";

import { fetchAPI } from "@/lib/apiClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "El usuario y la contraseña son obligatorios." };
  }

  try {
    const tokenBase64 = Buffer.from(`${username}:${password}`).toString("base64");

    await fetchAPI("/me", tokenBase64);

    const cookieStore = await cookies();
    cookieStore.set("authToken", tokenBase64, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

  } catch (error: any) {
    return { error: error.message || "Credenciales inválidas" };
  }

  redirect("/dashboard");
}
